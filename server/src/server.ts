/**
 * Crud app to manage docker containers
 */
import { DockerServerApi, ShortContainerInfo } from './docker';

const debug = console.log;
//////////////////////////////////
//APOLLO GRAPHQL SERVER
const { ApolloServer, gql } = require("apollo-server");

const IMAGE_DEFAULT = "node-hello";
const DOCKER_SERVER_HOST = "127.0.0.1";
const DOCKER_SERVER_PORT = "2375";

//TODO: see also ContainerInfo.State, ContainerInspect.Config.EnvState.Status
enum ContainerState {
  CREATING = "creating",
  RUNNING = "running",
  STOPPING = "stopping",
}
//Job key makes it unique
//if change, ensure gql matches
interface JobKey {
  name: string;//unique job name
  image: string;
}
interface Job extends JobKey {
  containerId?: string;//appears after container created
  containerState: ContainerState;
  host: string;//docker server address
  port: string;
}
const jobs: Job[] = [];

let gExposedPort = 40000;

const typeDefs = gql`
type JobKey {
  name: String!
}
type Job {
  containerId: String
  containerState: String
  host: String
  image: String
  name: String
  port: String
}
type Query {
  jobs: [Job]
}
type Mutation{
  createJob(name: String!, image:String!):Job
  deleteJob(name: String!):Boolean
}
`;
const resolvers = {
  Query: {
    jobs: () => jobs,
  },
  Mutation: {
    createJob: async (
      parent: any, //parent = An object that contains the result returned from the resolver on the parent type
      arg: JobKey,//args - An object that contains the arguments passed to the field
      //context - An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
      //info - Information about the execution state of the operation which should only be used in advanced cases
    ) => {
      //let {name} = arg;
      debug(`createJob: arg= ${JSON.stringify(arg)}`);
      return createJob(arg)
    },
    deleteJob: async (
      parent: any, //parent = An object that contains the result returned from the resolver on the parent type
      arg: JobKey,//args - An object that contains the arguments passed to the field
      //context - An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
      //info - Information about the execution state of the operation which should only be used in advanced cases
    ) => {
      debug(`deleteJob: arg= ${JSON.stringify(arg)}`);
      return deleteJob(arg)
    },
  }
};
const dockerApi = new DockerServerApi({
  host: DOCKER_SERVER_HOST,
  port: DOCKER_SERVER_PORT,
});
/**
 * Change job state
 * @param job
 * @param containerState
 */
function changeJobState(job: Job, containerState: ContainerState) {
  debug(`job ${job.name} ${job.containerState} => ${containerState}`);
  job.containerState = containerState;
}
/**
 * Create job
 */
function createJob(arg: JobKey): Job {
  const { name, image } = arg;//unique job name, that container needs to find config for this job. TODO: change to containerId
  if (!name) {
    debug(`create job has no name`);
  }
  //const image = IMAGE_DEFAULT;
  const port = getNextPort();//http exposed port to access container web page.
  let job: Job = {
    //containerId://no container Id yet
    containerState: ContainerState.CREATING,
    host: DOCKER_SERVER_HOST,//placeholder - shouldn't need it docker module initialized with server address
    image: image,
    name: name || "unknown",
    port: port,
  }
  jobs.push(Object.assign({}, job));
  debug(`${JSON.stringify(jobs, null, 2)}`);
  debug(`return: ${JSON.stringify(job)}`);

  //start container image that listens on http port
  dockerApi.createContainer({ image, port }, dockerApi.envArrayFromObj({ name }));
  return job;
}
/**
 * Delete job if running
 */
function deleteJob(arg: JobKey): boolean {
  let { name } = arg;

  let result = false;
  //find job to remove
  for (let i = jobs.length - 1; i >= 0; i--) {
    let job = jobs[i];
    if (job.name === name && job.containerId) {
      if (job.containerState === ContainerState.RUNNING) {
        //ask to delete job, but not deleted sometime on next read
        changeJobState(job, ContainerState.STOPPING);
        dockerApi.stopContainerById(job.containerId);
        result = true;
      }
      break;
    }
  }
  return result;
}
/**
 * Get next port. Every new container given unique exposed port. Simple for now.
 */
function getNextPort() {
  gExposedPort++;
  return gExposedPort.toString();
}
/**
 * Monitor containers
 */
function monitorContainers() {
  dockerApi.readContainerIds()
    .then((containerIds: string[]) => {
      if (containerIds.length === 0) {
        removeStoppingJobs([]);
        return;
      }
      //inspect leftover containers for details to match jobs
      dockerApi.inspectMultiple(containerIds)
        .then(containers => {
          processContainers(containers);
        })
    })
}
/**
 * Process containers
 * @param containers
 */
function processContainers(containers: ShortContainerInfo[]) {
  for (let i = containers.length - 1; i >= 0; i--) {
    let container = containers[i];
    if (container === undefined) {
      continue;
    }
    let containerId = container.containerId;
    for (const job of jobs) {
      let { containerState, name } = job;
      if (containerState === ContainerState.CREATING) {
        if (container.name === name) {
          job.containerId = containerId;
          changeJobState(job, ContainerState.RUNNING);
          containers.splice(i, 1);
          break;
        }
        continue;
      }
      if (containerState === ContainerState.RUNNING) {
        if (containerId === job.containerId) {
          containers.splice(i, 1);
          break;
        }
      }
    }
  }
  //remove stopping jobs, that have no container left, and containers where job is still stopping
  containers = removeStoppingJobs(containers);

  //now unexpected containers e.g. maybe we rebooted
  //remaining containers are apparent work we don't have record for
  //TODO - fix discovery
  for (const container of containers) {
    if (container) {
      let { containerId, name, port } = container;
      let job: Job = {
        containerId,
        containerState: ContainerState.RUNNING,
        host: DOCKER_SERVER_HOST,
        image: IMAGE_DEFAULT,//TODO: can't know this
        name,
        port,
      }
      jobs.push(job);
      gExposedPort = parseInt(port);
    }
  }
}
/**
 * Remove stopping jobs
 * @param containerIds - existing containers
 */
function removeStoppingJobs(containers: ShortContainerInfo[]) {
  for (let i = jobs.length - 1; i >= 0; i--) {
    let job = jobs[i];
    if (job.containerState !== ContainerState.STOPPING) {
      continue;
    }
    if (job.containerId === undefined) {//fail safe - should only happen if CREATING
      continue;
    }
    //all stopping jobs have container ids
    let count = containers.length;
    for (let j = containers.length - 1; j >= 0; j--) {
      let container = containers[j]
      if (job.containerId === container.containerId) {
        //matching container, not yet stopped, so done processing
        //debug(`stopping job container found. remove container`)
        containers.splice(j, 1);
        break;
      }
    }
    if (count === containers.length) {
      //no container found for this job so remove
      jobs.splice(i, 1);
    }
  }
  return containers;
}
/////////////////////////////////////
//MAIN
const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(() => {
  debug(`GraphQL server ready`);
});
setInterval(monitorContainers, 1000);

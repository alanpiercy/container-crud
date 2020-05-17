import dockerode = require('dockerode');
//note: installing @types/dockerode, lets editor know params and return types e.g. createContainer container: type

//const Dockerode = new dockerode({ host: DOCKER_SERVER_HOST, port: DOCKER_SERVER_PORT });
//following makes the following
//CONTAINER ID        IMAGE          COMMAND                  CREATED             STATUS              PORTS                               NAMES
//377bcfcdc94d        node-hello     "docker-entrypoint.s…"   20 seconds ago      Up 19 seconds       0.0.0.0:40001->4000/tcp   stupefied_bartik

const INTERNAL_PORT_PROTOCOL = "4000/tcp";//expect all containers to expose 4000

interface NetAddr {
  host?: string,
  port: string,
}
interface ContainerArg {
  image: string,
  port: string, //exposed port e.g. 40000
}
//simplify container info to fit our needs
interface ShortContainerInfo {
  containerId: string,
  name: string,
  port: string,//exposed port
}
const debug = console.log;

class DockerServerApi {
  serverAddr: NetAddr;
  Dockerode: dockerode;

  constructor(addr: NetAddr) {//host: number, port: string){
    let { host, port } = addr;
    this.serverAddr = { host, port };
    debug(`server addr: ${JSON.stringify(this.serverAddr)}`);
    this.Dockerode = new dockerode(this.serverAddr);
  }
  /**
   * Create container
   * @param arg
   * @param envs
   */
  createContainer(arg: ContainerArg, envs: string[]) {
    let { image, port } = arg;
    debug(`create container: ${JSON.stringify(arg)}`);

    this.Dockerode.createContainer({
      Image: image,
      Env: envs,
      HostConfig: {
        PortBindings: {//assume Serenity runs on this port. Is HostIP always 0.0.0.0?
          "4000/tcp": [{
            HostIP: "0.0.0.0",
            HostPort: port,
          }]
        },
      },
      //name: "container-serenity"
    }).then((container) => {//}: dockerode.Container) {
      debug(`create container id: ${container.id}`);
      return container.start();
    })
  }
  /**
   * Delete all containers
   */
  async deleteAllContainers() {
    let containers = await this.Dockerode.listContainers();

    //debug(`delete containers: ${JSON.stringify(containers, null, 2)}`);
    if (!containers) {
      return;
    }
    containers.forEach((container) => {
      this.stopContainerById(container.Id);
    });
  }
  /**
   * Env string array from obj
   */
  envArrayFromObj(obj: { name: string }): string[] {
    let envs = [];
    let { name } = obj;
    if (name) {
      envs.push(`name=${name}`);
    }
    return envs;
  }
  /**
   * Inspect container. Gets param/env passed when image started i.e. name, port
   * @param containerId
   */
  async inspect(containerId: string) {
    let container = this.Dockerode.getContainer(containerId);
    // query API for container info
    let obj = await container.inspect()
    if (!obj) {
      debug(`inspect null obj`);
      return;
    }
    let { Config, HostConfig } = obj;
    //get exposed port
    let { PortBindings } = HostConfig;
    let ports = PortBindings[INTERNAL_PORT_PROTOCOL];
    if (!ports) {
      debug(`inspect null obj PortBindings[${INTERNAL_PORT_PROTOCOL}]`);
      return;
    }
    let port;
    if (ports.length > 0) {
      port = ports[0].HostPort
    }
    //get env arg fields: name
    let { Env } = Config;
    let name: string | undefined;
    if (Array.isArray(Env)) {
      for (const str of Env) {
        if (str.startsWith("name")) {
          let fields = str.split("=");
          name = fields[1].trim();
        }
      }
    }
    if (name) {
      return {
        name: name,
        containerId: containerId,
        port: port,
      };
    }
  }
  /**
   * Inspect multiple
   * @param containerIds
   */
  async inspectMultiple(containerIds: string[]) {
    let containers: ShortContainerInfo[] = [];
    let inspects: (ShortContainerInfo | undefined)[] = [];
    try {
      inspects = await Promise.all(containerIds.map(id => {
        return this.inspect(id);
      }))
    } catch (err) {
      console.log(`inspect err ${err}`);
    }
    finally {
      if (inspects) {
        //remove undefined containers
        for (const el of inspects) {
          if (el !== undefined) {
            containers.push(el);
          }
        }
      }
      return containers;
    }
  }
  /**
   * Read containers
   */
  async readContainerIds() {
    try {
      let containers = await this.Dockerode.listContainers();
      if (Array.isArray(containers) && containers.length > 0) {
        return containers.map(info => {
          return info.Id;
        })
      }
      return [];
    } catch (err) {
      return [];
    }
  }
  /**
   * Stop container by id
   * @param id
   */
  async stopContainerById(id: string) {
    let container = this.Dockerode.getContainer(id);
    if (!container) {
      debug(`can't stop container, bad id=${id}`);
      return;
    }
    container.stop((err, err2) => {
      debug(`stop container id=${id}, err=${err}, err2=${err2}`);
    });
  }
}
export { DockerServerApi, ShortContainerInfo };
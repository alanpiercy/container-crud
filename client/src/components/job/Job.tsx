//import React, { Component } from "react";
import React from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl"
import MenuItem from "@material-ui/core/MenuItem";
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { InputLabel } from "@material-ui/core";

const GQL = {
  CREATE_JOB: gql`
  mutation CreateJob($name: String!, $image: String!){
      createJob(name: $name, image: $image){
        containerId
        containerState
        host
        image
        name
        port
      }
  }`,
  READ_JOBS: gql`
  query ReadJobs{
      jobs {
        containerId
        containerState
        host
        image
        name
        port
      }
  }`,
  DELETE_JOB: gql`
  mutation DeleteJob($name: String!){
      deleteJob(name: $name)
  }`,
}
/*
//Sample playground queries
mutation CreateJob{
    createJob(name: "76", image: "node-hello"){
    containerId
    containerState
    host
    image
    name
    port
    }
  }
query ReadJobs{
    jobs {
      containerId
      containerState
      host
      image
      name
      port
    }
}
mutation DeleteJob{
  deleteJob(name: "76")
}
*/
interface Job {
  name: string;
  image: string;
  host: string;
  port: string;
  containerId: string;
  containerState: string;
}
/**
 * Add job
 */
function AddJob() {
  let input: HTMLInputElement | null;
  const [createJob] = useMutation(GQL.CREATE_JOB);

  const [image, setImage] = React.useState('');
  return (
    <div>
      <form
        onSubmit={ev => {
          ev.preventDefault();
          createJob({
            variables: {
              name: (input) ? input.value : "",
              image: image,
            },

            //update data after insert
            update(cache, { data }) {
              // do not update cache for public feed
              if (!data) {
                return null;
              }
              const getExisting: any = cache.readQuery({ query: GQL.READ_JOBS });
              const existingJobs = getExisting ? getExisting.jobs : [];
              const newJob = data.createJob!;
              cache.writeQuery({
                query: GQL.READ_JOBS,
                data: { jobs: [newJob, ...existingJobs] }
              });
            }
          });
          if (input) {
            input.value = '';
          }
        }}
      >
        <h3>Create job</h3>
        <input
          ref={node => {
            input = node;
          }}
        /> Job name<br></br><br></br>
        <ImageChoice image={image} setImage={value => setImage(value)}/><br></br>
        <Button variant="contained" color="primary" disableElevation type="submit">Add</Button>
      </form>
    </div>
  );
}
/**
 * Delete job
 * @param prop
 */
function DeleteJob(prop: {name: string}) {
  const [deleteJob] = useMutation(GQL.DELETE_JOB);

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          deleteJob({
            variables: { name: prop.name},

            //update data after insert
            update(cache, { data }) {
              // do not update cache for public feed
              if (!data) {
                return null;
              }
              const getExisting: any = cache.readQuery({ query: GQL.READ_JOBS });
              const newJobs = getExisting!.jobs.filter((t:any) => (t.name !== prop.name));
              cache.writeQuery({
                query: GQL.READ_JOBS,
                data: { jobs: newJobs }
              });
            }
          });
        }}
      >
        <Button variant="contained" color="primary" disableElevation type="submit">Delete</Button>
      </form>
    </div>
  );
}
/**
 * Read Jobs manually, if not using pollInterval
 */
const ReadJobs = () => {
  const { loading, error, data, refetch } = useQuery(GQL.READ_JOBS, {
  });

  if (loading) {
    return (<div>Loading...</div>);
  }
  if (error || !data) {
    return (<div>Error...</div>);
  }
  return (
    <div>
      <Button variant="contained" color="primary" disableElevation type="submit" onClick={() => refetch()}>
        Refresh</Button>
    </div>
  );
};
interface ImageChoiceProps{
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>
}
/**
 * Image choice
 */
const ImageChoice = (props: ImageChoiceProps) => {
  return (
    <div>
      <FormControl variant="filled">
        <InputLabel>Image</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.image}
          onChange={ev => props.setImage(typeof (ev.target.value) == 'string' ? ev.target.value : "")}
        >
        <MenuItem value={"node-hello"}>Node-Hello</MenuItem>
        <MenuItem value={"other"}>Other</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}
/**
 * Jobs
 */
const Jobs = () => {
  const { loading, error, data } = useQuery(GQL.READ_JOBS,{
    pollInterval: 500,
  });
  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  const classes = useStyles();

  if (loading) {
    return (<div>Loading...</div>);
  }
  if (error || !data) {
    return (<div>Error...</div>);
  }
  let { jobs } = data;
  if (loading || !jobs) {
    return (<div>loading ...</div>);
  }
  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Job Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Container Id</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Url</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {jobs.map((job: Job, i: number) =>
              <TableRow key={i}>
                <TableCell>{job.name}</TableCell>
                <TableCell>{job.image}</TableCell>
                <TableCell>{job.containerId}</TableCell>
                <TableCell>{job.containerState}</TableCell>
                <TableCell><a href={`http://${job.host}:${job.port}`} target="_blank" rel="noopener noreferrer">Open</a></TableCell>
                <TableCell><DeleteJob name={job.name} /></TableCell>
              </TableRow>
            )
            }
          </TableBody>
        </Table>
      </TableContainer>

      <AddJob />
    </div>
  );
}
export default Jobs
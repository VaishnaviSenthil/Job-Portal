import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { jobLoadSingleAction } from "../../redux/actions/jobActions";
import { userJobApplyAction } from "../../redux/actions/userAction";
import LoadingBox from "../../components/LoadingBox";
import { Card, TextField, TextareaAutosize, Grid } from "@mui/material";
import { Box, Container } from "@mui/system";
import axios from "axios";

function Modal({ jobId, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/job/${jobId}`)
      .then((response) => {
        setJobDetails(response.data.job);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job details:", error);
        setLoading(false);
      });
  }, [jobId]);

  const applyForAJob = () => {
    dispatch(
      userJobApplyAction({
        jobId: jobDetails && jobDetails._id,
        title: jobDetails && jobDetails.title,
        company: jobDetails && jobDetails.company,
        description: jobDetails && jobDetails.description,
        skills: jobDetails && jobDetails.skills,
        salary: jobDetails && jobDetails.salary,
        location: jobDetails && jobDetails.location,
      })
    );
    onClose();
  };

  return (
    <>
      <Dialog open={true} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent>
          {loading ? (
            <LoadingBox />
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <p>Role:</p>
                  <TextField
                    value={jobDetails.title}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <p>Company:</p>
                  <TextField
                    value={jobDetails.company}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <p>Description:</p>
                  <TextareaAutosize
                    value={jobDetails.description}
                    minRows={2}
                    readOnly
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      minWidth:"50%",
                      overflow: "auto",
                      resize:"vertical",
                      fontFamily: "inherit", 
                      fontSize: "16px",
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <p>Skills:</p>
                  <TextField
                    value={jobDetails.skills}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <p>Salary:</p>
                  <TextField
                    value={jobDetails.salary}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <p>Location:</p>
                  <TextField
                    value={jobDetails.location}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <p>Available: </p>
                  <TextField
                    value={jobDetails.available ? "Yes" : "No"}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <p> Deadline: </p>
                  <TextField
                    value={moment(jobDetails.deadline).format("MMM D, YYYY")}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <p>Job mode:</p>
                  <TextField
                    value={jobDetails.jobCategory}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            color="primary"
            variant="contained"
            sx={{
              backgroundColor: "red",
              "&:hover": { backgroundColor: "darkred" },
            }}
          >
            Close
          </Button>
          <Button
            onClick={applyForAJob}
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "green",
              "&:hover": { backgroundColor: "darkgreen" },
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Modal;

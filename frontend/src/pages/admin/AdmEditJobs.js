import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, MenuItem, Typography, Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { jobTypeLoadAction } from "../../redux/actions/jobTypeAction";
import {
  jobLoadSingleAction,
  updateJobAction,
} from "../../redux/actions/jobActions";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../../components/LoadingBox";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { isMobile } from "react-device-detect";

const validationSchema = yup.object({
  title: yup.string("Enter a job title").required("Title is required"),
  salary: yup.number("Enter a salary").required("Salary is required"),
  location: yup.string("Enter a location").required("Location is required"),
  available: yup
    .string("Enter Job availability ")
    .required("Availability is required"),
  deadline: yup
    .date("Enter a Deadline")
    .min(
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      "Deadline must be greater than current date"
    ),
  jobType: yup.string("Select a Category").required("Category is required"),
  jobCategory: yup.string("Select a Job Mode").required("Job Mode is required"),
});

const AdmEditJobs = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.singleJob);
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobDetail, setJobDetail] = useState(null);
  const [load, setLoad] = useState(true);
  const { jobType } = useSelector((state) => state.jobType);
  const jobCategories = ["Full-Time", "Part-Time", "Hybrid", "Internship"];

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await axios.get(`/api/job/${id}`);
        setJobDetail(response.data.job);
        formik.setValues(response.data.job);
        setLoad(false);
        if (Object.keys(jobDetail).length > 0) {
          setLoad(false);
        }
      } catch (error) {
        console.error("Error fetching job detail:", error);
      }
    };

    fetchJobDetail();
    dispatch(jobLoadSingleAction());
    dispatch(jobTypeLoadAction());
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      title: "",
      salary: "",
      location: "",
      deadline: "",
      available: "",
      jobCategory: "",
      jobType: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (values.deadline instanceof Date) {
        values.deadline = values.deadline.toISOString().split("T")[0];
      }
      dispatch(updateJobAction(id, values));
      navigate(-1);
    },
  });

  const handleGoBack = () => {
    navigate("/admin/jobs");
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "86vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: "600px",
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Button
              variant="contained"
              onClick={handleGoBack}
              sx={{
                marginLeft: isMobile ? "-200px" : "500px",
              }}
            >
              <ArrowBackIcon />
            </Button>
            <Typography variant="h5" component="h2" sx={{ pb: 1 }}>
              Edit a Job
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  id="title"
                  label="Title"
                  name="title"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ style: { height: "10px" } }}
                  placeholder="Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="company"
                  label="Company"
                  name="company"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ style: { height: "10px" } }}
                  placeholder="Company"
                  value={formik.values.company}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.company && Boolean(formik.errors.company)
                  }
                  helperText={formik.touched.company && formik.errors.company}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  id="salary"
                  label="Salary"
                  name="salary"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ style: { height: "10px" } }}
                  placeholder="Salary"
                  value={formik.values.salary}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.salary && Boolean(formik.errors.salary)}
                  helperText={formik.touched.salary && formik.errors.salary}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="skills"
                  label="Skills"
                  name="skills"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ style: { height: "10px" } }}
                  placeholder="Skills"
                  value={formik.values.skills}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.skills && Boolean(formik.errors.skills)}
                  helperText={formik.touched.skills && formik.errors.skills}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="location"
                  label="Location"
                  name="location"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ style: { height: "10px" } }}
                  placeholder="Location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.location && Boolean(formik.errors.location)
                  }
                  helperText={formik.touched.location && formik.errors.location}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  sx={{
                    width: isMobile ? "100%" : "225px",
                    "& select": { height: "10px" },
                  }}
                  id="deadline"
                  label="Deadline"
                  name="deadline"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ style: { height: "10px" } }}
                  placeholder="Deadline"
                  value={formik.values.deadline}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.deadline && Boolean(formik.errors.deadline)
                  }
                  helperText={formik.touched.deadline && formik.errors.deadline}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  sx={{
                    width: isMobile ? "100%" : "225px",
                    "& select": { height: "10px" },
                  }}
                  variant="outlined"
                  name="jobType"
                  id="jobType"
                  select
                  label="Category"
                  value={formik.values.jobType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.jobType && Boolean(formik.errors.jobType)
                  }
                  helperText={formik.touched.jobType && formik.errors.jobType}
                >
                  {jobType &&
                    jobType.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.jobType}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                 sx={{
                  width: isMobile ? "100%" : "225px",
                  "& select": { height: "10px" },
                }} 
                  variant="outlined"
                  name="jobCategory"
                  id="jobCategory"
                  select
                  label="Job-Mode"
                  value={formik.values.jobCategory}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.jobCategory &&
                    Boolean(formik.errors.jobCategory)
                  }
                  helperText={
                    formik.touched.jobCategory && formik.errors.jobCategory
                  }
                >
                  {jobCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item  xs={isMobile ? 12 : 11}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ style: { height: "10px" } }}
                  placeholder="Description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
              Save Edited Job
            </Button>
          </Box>
        </Box>
      </form>
    </>
  );
};

export default AdmEditJobs;

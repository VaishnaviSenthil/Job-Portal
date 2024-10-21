import { Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createJobTypeAction } from "../../redux/actions/jobTypeAction";
import { useEffect } from "react";
import { userProfileAction } from "../../redux/actions/userAction";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  jobTypeName: yup.string("Enter a Category").required("Category is required"),
});

const DashCreateCategory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userProfileAction());
  }, []);
  const { user } = useSelector((state) => state.userProfile);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      user: user && user._id,
      jobTypeName: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      console.log(values);
      dispatch(createJobTypeAction(values));

      actions.resetForm();
    },
  });

  const handleGoBack = ()=>{
    navigate('/admin/category')
  }

  return (
    <>
    <br />
    <br />
    <br />
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 4,
        }}
      >
        <Box
          onSubmit={formik.handleSubmit}
          component="form"
          className="form_style border-style"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              onClick={handleGoBack}
              sx={{ marginRight: 40 }}
            >
              <ArrowBackIcon />
            </Button>
            <Typography variant="h5" component="h2" sx={{ pb: 3 }}>
              Create a Category
            </Typography>
            <TextField
              sx={{ mb: 3 }}
              
              id="jobTypeName"
              label="category"
              name="jobTypeName"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="category name"
              value={formik.values.jobTypeName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.jobTypeName && Boolean(formik.errors.jobTypeName)
              }
              helperText={
                formik.touched.jobTypeName && formik.errors.jobTypeName
              }
            />

            <Button width='100px' variant="contained" type="submit">
              Create category
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DashCreateCategory;

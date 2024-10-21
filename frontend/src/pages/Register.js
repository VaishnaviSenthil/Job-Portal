//New Register

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  FormControl,
  FormLabel,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import fetchStatesIndia from "../utils/fetchStates";
import fetchCitiesState from "../utils/fetchCities";
import { useState } from "react";
import axios from "axios";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const defaultTheme = createTheme();

const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/~`]).{8,}$/,
      "Password must contain at least 1 capital letter, 1 symbol, 1 number, and be at least 8 characters long"
    ),
  mobileNumber: Yup.number()
    .integer()
    .typeError("Mobile number must be a number")
    .min(6000000000, "Mobile number is not valid")
    .max(9999999999, "Mobile number is not valid")
    .required("Mobile Number is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  dateOfBirth: Yup.date()
    .nullable()
    .required("Date of Birth is required")
    .test(
      "is-at-least-15",
      "You must be at least 15 years old",
      function (value) {
        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 15);
        return value && value <= cutoffDate;
      }
    ),
  gender: Yup.string().required("Gender is required"),
});

export default function SignUp() {
  const [states, setStates] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cities, setCities] = useState([]);
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      mobileNumber: "",
      dateOfBirth: "",
      gender: "",
      state: "",
      city: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post("/api/signup", values);
        toast.success("Registration Successful");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        console.error("Error registering user:", error);
        toast.error(error.response.data.error);
      }
    },
  });

  const handleStateDropdownClick = async () => {
    if (!isDropdownOpen) {
      try {
        const indiaStates = await fetchStatesIndia();
        console.log(indiaStates);
        setStates(indiaStates);
      } catch (error) {
        console.error("Error fetching states for India", error);
      }
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleStateChange = async (selectedState) => {
    try {
      const selectedStateObject = states.find(
        (state) => state.name === selectedState
      );

      if (selectedStateObject) {
        const stateCode = selectedStateObject.iso2; // Assuming id is the state code
        const fetchedCities = await fetchCitiesState(stateCode);
        setCities(fetchedCities);
        setSelectedState(selectedState);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Lets Start with Registration
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 2 }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  label="FirstName"
                  name="firstName"
                  placeholder="FirstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  onBlur={formik.handleBlur}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  onBlur={formik.handleBlur}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Mobile Number"
                  id="mobileNumber"
                  value={formik.values.mobileNumber}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.mobileNumber &&
                    Boolean(formik.errors.mobileNumber)
                  }
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.mobileNumber && formik.errors.mobileNumber
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="dateOfBirth"
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.dateOfBirth &&
                    Boolean(formik.errors.dateOfBirth)
                  }
                  helperText={
                    formik.touched.dateOfBirth && formik.errors.dateOfBirth
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                >
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Gender
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-label="gender"
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio />}
                      label="Other"
                    />
                  </RadioGroup>
                  {formik.touched.gender && Boolean(formik.errors.gender) && (
                    <FormHelperText>{formik.errors.gender}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  onClick={handleStateDropdownClick}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                >
                  <FormLabel id="state-label">State</FormLabel>
                  <Select
                    labelId="state-label"
                    id="state"
                    open={isDropdownOpen}
                    onClose={() => setIsDropdownOpen(false)}
                    // label="State"
                    name="state"
                    value={formik.values.state}
                    onChange={(event) => {
                      const selectedState = event.target.value;
                      formik.handleChange(event);
                      handleStateChange(selectedState);
                    }}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    onBlur={formik.handleBlur}
                    helperText={formik.touched.state && formik.errors.state}
                  >
                    {states.map((state) => (
                      <MenuItem key={state.id} value={state.name}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.state && Boolean(formik.errors.state) && (
                    <FormHelperText>{formik.errors.state}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth  error={formik.touched.city && Boolean(formik.errors.city)}>
                  <FormLabel id="city-label">City</FormLabel>
                  <Select
                    labelId="city-label"
                    id="city"
                    label="City"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    onBlur={formik.handleBlur}
                    disabled={!formik.values.state}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city.id} value={city.name}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.city && Boolean(formik.errors.city) && (
                    <FormHelperText>{formik.errors.city}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2, ml: 17.5 }}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
}

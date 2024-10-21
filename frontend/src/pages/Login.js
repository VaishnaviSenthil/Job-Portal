import { Avatar, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { userSiginAction } from "../redux/actions/userAction";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const LogIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, userInfo } = useSelector((state) => state.signIn);
  const [showPassword, setShowPassword] = React.useState(false);
  const [resetFormData, setResetFormData] = useState({
    token: "",
    newPassword: "",
  });
  const [resetMode, setResetMode] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      if (userInfo.role === 1) {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    }
  }, [isAuthenticated]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      dispatch(userSiginAction(values));
      actions.resetForm();
    },
  });

  const responseGoogleSuccess = (response) => {
    console.log(response);
    axios({
      method: "POST",
      url: "/api/googleLogin",
      data: { tokenId: response.credential },
    }).then((response) => {
      console.log("Success", response.data);
      dispatch(userSiginAction(response.data));
    });
  };
  const responseGoogleError = (response) => {
    console.error("Google login error:", response);
  };

  const handleResetFormChange = (event) => {
    const { name, value } = event.target;
    setResetFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordReset = async () => {
    try {
      const response = await axios.post(
        `/api/resetPassword/${resetFormData.token}`,
        {
          password: resetFormData.newPassword,
        }
      );
      toast.success(response.data.message);
      setResetFormData({
        token: "",
        newPassword: "",
      });
      setResetMode(!resetMode);
      console.log(response.data);
    } catch (error) {  
      console.error("Error resetting password:", error);
      toast.error(error.response.data.message);
      // Handle error messages
    }
  };

  const handleToggleResetMode = async () => {
    const userEmail = formik.values.email;

    if (!userEmail) {
      toast.error("Please provide your email to send reset token");
    }

    try {
      const response = await axios.post("/api/resetToken", {
        email: userEmail,
      });

      toast.success("Token sent to your email successfully");
      setResetMode(!resetMode);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error requesting reset token:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          height: "81vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
            <Avatar sx={{ m: 1, bgcolor: "primary.main", mb: 3 }}>
              <LockOpenIcon sx={{ color: "white" }} />
            </Avatar>
            {resetMode ? (
              // Fields for password reset
              <>
                <TextField
                  sx={{
                    mb: 3,
                    "& .MuiInputBase-root": {
                      color: "text.secondary",
                    },
                    fieldset: { borderColor: "rgb(231, 235, 240)" },
                    width: "300px",
                  }}
                  id="token"
                  name="token"
                  label="Token"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Token"
                  value={resetFormData.token}
                  onChange={handleResetFormChange}
                />

                <TextField
                  sx={{
                    mb: 3,
                    "& .MuiInputBase-root": {
                      color: "text.secondary",
                    },
                    fieldset: { borderColor: "rgb(231, 235, 240)" },
                    width: "300px",
                  }}
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="New Password"
                  value={resetFormData.newPassword}
                  onChange={handleResetFormChange}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                />
              </>
            ) : (
              // Existing form fields
              <>
                <TextField
                  sx={{
                    mb: 3,
                    "& .MuiInputBase-root": {
                      color: "text.secondary",
                    },
                    fieldset: { borderColor: "rgb(231, 235, 240)" },
                    width: "300px",
                  }}
                  id="email"
                  label="E-mail"
                  name="email"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="E-mail"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  sx={{
                    mb: 3,
                    "& .MuiInputBase-root": {
                      color: "text.secondary",
                    },
                    fieldset: { borderColor: "rgb(231, 235, 240)" },
                    width: "300px",
                  }}
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                />
              </>
            )}
            <Button
              variant="contained"
              sx={{ marginBottom: 1 }}
              onClick={resetMode ? handlePasswordReset : formik.handleSubmit}
            >
              {resetMode ? "Reset Password" : "Log In"}
            </Button>
            <Button
              variant="contained"
              onClick={handleToggleResetMode}
              sx={{ marginBottom: 2 }}
            >
              {resetMode ? "Back to Log In" : "Forgot Password?"}
            </Button>
            <GoogleOAuthProvider clientId="56033284269-nk4tng8cmkleg9foqeekbfpflr6efqji.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={responseGoogleSuccess}
                onError={responseGoogleError}
              />
            </GoogleOAuthProvider>
          </Box>
        </Box>
      </Box>

      <Footer />
    </>
  );
};

export default LogIn;

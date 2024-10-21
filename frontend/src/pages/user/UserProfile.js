import React, { useEffect } from "react";

import { useState } from "react";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userProfileAction } from "../../redux/actions/userAction";
import PersonIcon from "@mui/icons-material/Person";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { toast } from "react-toastify";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import ResumeViewer from "../admin/ResumeViewer";
import { isMobile } from "react-device-detect";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import headerImage from "../../images/profileBg.jpg";
import CallIcon from "@mui/icons-material/Call";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";

const UserProfile = () => {
  const { user } = useSelector((state) => state.userProfile);
  console.log("User",user)
  const dispatch = useDispatch();

  const { palette } = useTheme();
  const [resume, setResume] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [errors, setErrors] = useState({});
  const [save,setSave] = useState(false);

  useEffect(() => {
    dispatch(userProfileAction());
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobileNumber,
      school: user.school,
      college: user.college,
      skills: user.skills,
      experience: user.experience,
      about: user.about,
      fileName: user.email,
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSave(true);
    setEditedUser((prevEditedUser) => ({
      ...prevEditedUser,
      [name]: value,
    }));
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    let error = "";
    switch (name) {
      case "mobile":
        const mobileRegex = /^[0-9]{10}$/;
        if (!value.match(mobileRegex)) {
          error = "Mobile number should be 10 digits";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.match(emailRegex)) {
          error = "Invalid email format";
        }
        break;
      case "firstName":
      case "lastName":
      case "school":
      case "college":
      case "about":
        const lettersOnlyRegex = /^[A-Za-z\s]+$/;
        if (!value.match(lettersOnlyRegex)) {
          error = "Value should only contain letters and spaces";
        }
        break;
      case "skills":
        const lettersAndCommaRegex = /^[A-Za-z,]+$/;
        if (!value.match(lettersAndCommaRegex)) {
          error = "Value should only contain letters and commas";
        }
        break;
      case "experience":
        const experience = parseInt(value, 10);
        if (isNaN(experience) || !Number.isInteger(experience)) {
          error = "Experience should be an integer";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleUploadResume = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf, .doc, .docx";
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      setResume(file);
    });
    input.click();
    setSave(true);
  };
  const handleGoBack = () => {
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      toast.error("Please fix validation errors before saving.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("resume", resume);

      Object.keys(editedUser).forEach((key) => {
        formData.append(key, editedUser[key]);
      });

      const userInfo = localStorage.getItem("userInfo");
      const user = JSON.parse(userInfo);
      const userId = user.userId;

      await axios.put(`/api/user/edit/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setSave(false);
    setIsEditing(false);
  
  };

  // user Resume

  const [fileUrl, setFileUrl] = useState(null);
  const handleCloseResume = () => {
    setFileUrl(null);
  };
  const handleResume = async (path) => {
    try {
      if (path) {
        await axios
          .get(`/api/userResume/${path}`, { responseType: "blob" })
          .then(async (response) => {
            console.log("Response", response);

            const url = URL.createObjectURL(response.data);
            setFileUrl(url);
          });
      } else {
        toast.error("You did not Sumitted Resume");
      }
    } catch (error) {
      console.error("Error fetching the file:", error);
    }
  };


  const handleCloseButtonClick = () => {
    setIsEditing(false);
  };

  return (
    <>
      <Box sx={{ maxWidth: "60%", margin: "auto" }}>
        <Card sx={{ minWidth: 265, bgcolor: palette.secondary.midNightBlue }}>
        
          <CardContent>
          
            <Typography
              sx={{ fontSize: 20, marginLeft: 23 }}
              color="#000000"
              gutterBottom
            >
              <PersonIcon /> Personal Info {isEditing &&<CloseIcon sx={{ cursor: 'pointer' , marginLeft:25 }} color="error" onClick={handleCloseButtonClick} />}
            </Typography>
            <hr style={{ marginBottom: "10px" }} />

            {isEditing ? (
              <>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={editedUser.firstName}
                  onChange={handleInputChange}
                  helperText={errors.firstName}
                  sx={{ marginBottom: 0.8, marginLeft: 4, width: "40%" }}
                />
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={editedUser.lastName}
                  onChange={handleInputChange}
                  helperText={errors.lastName}
                  sx={{ marginBottom: 0.8, marginLeft: 5, width: "40%" }}
                />
                <TextField
                  name="email"
                  label="Email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  helperText={errors.email}
                  sx={{ marginBottom: 0.8, marginLeft: 4, width: "40%" }}
                />
                <TextField
                  name="mobile"
                  label="Mobile"
                  value={editedUser.mobile}
                  onChange={handleInputChange}
                  helperText={errors.mobile}
                  sx={{ marginBottom: 0.8, marginLeft: 5, width: "40%" }}
                />
                <TextField
                  name="school"
                  label="School"
                  value={editedUser.school}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 0.8, marginLeft: 4, width: "40%" }}
                />
                <TextField
                  name="college"
                  label="College"
                  value={editedUser.college}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 0.8, marginLeft: 5, width: "40%" }}
                />
                <TextField
                  name="skills"
                  label="Skills"
                  value={editedUser.skills}
                  onChange={handleInputChange}
                  helperText={errors.skills}
                  sx={{ marginBottom: 0.8, marginLeft: 4, width: "40%" }}
                />
                <TextField
                  name="experience"
                  label="Experience"
                  value={editedUser.experience}
                  onChange={handleInputChange}
                  helperText={errors.experience}
                  sx={{ marginBottom: 0.8, marginLeft: 5, width: "40%" }}
                />
                <TextField
                  name="about"
                  label="About"
                  value={editedUser.about}
                  onChange={handleInputChange}
                  helperText={errors.about}
                  sx={{ marginBottom: 0.5, marginLeft: 4, width: "87%" }}
                />
                <Tooltip
                  title={
                    user && user.resumePath
                      ? "Already Uploaded"
                      : "Not Uploaded"
                  }
                >
                  <Button
                    variant="contained"
                    onClick={handleUploadResume}
                    sx={{
                      marginLeft: 26,
                      backgroundColor:
                        user && user.resumePath ? "#4CAF50" : "red", // Green if user.resumePath exists, otherwise red
                      color: "white", // Set the text color to white
                      "&:hover": {
                        backgroundColor:
                          user && user.resumePath ? "#45a049" : "darkred", // Adjust hover color
                      },
                      width: "30%",
                    }}
                  >
                    {user && user.resumePath ? "Edit Resume" : "Upload Resume"}
                  </Button>
                </Tooltip>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    backgroundImage: `url(${headerImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: 150,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end", // Align content to the bottom of the box
                    padding: "10px",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: "white",
                      fontFamily: "'Roboto', sans-serif", // Example using Roboto font
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    {user && user.firstName} {user && user.lastName}
                  </Typography>
                  <br />
                  <Typography
                    variant="body"
                    sx={{
                      color: "#f0f0f0",
                      marginBottom: "5px",
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    <AlternateEmailIcon
                      fontSize="small"
                      sx={{ marginRight: "5px" }}
                    />
                    <span style={{ fontFamily: "Arial, sans-serif" }}>
                      {user && user.email}
                    </span>
                  </Typography>

                  <Typography
                    variant="body"
                    sx={{
                      color: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CallIcon fontSize="small" sx={{ marginRight: "5px" }} />
                    {user && user.mobileNumber}
                  </Typography>
                  <Typography
                    variant="body"
                    sx={{
                      color: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <InfoIcon fontSize="small" sx={{ marginRight: "5px" }} />
                    {user && user.about}
                  </Typography>
                </Box>

                <br />

                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography> Your Resume :</Typography>
                  <Button
                    onClick={() => handleResume(user.resumePath)}
                    variant="outlined"
                    color="primary"
                    sx={{
                      marginLeft: "30px",
                      backgroundColor:
                        user && user.resumePath ? "#4CAF50" : "red", // Set background color to green or red
                      "&:hover": {
                        backgroundColor:
                          user && user.resumePath ? "#45a049" : "darkred",
                      },
                      color: "white",
                      // marginTop:, // Add some top margin
                    }}
                  >
                    <RemoveRedEyeIcon
                      fontSize="small"
                      sx={{ marginRight: "5px", color: "#fff" }}
                    />
                    View Resume
                  </Button>
                </div>
                <ResumeViewer fileUrl={fileUrl} onClose={handleCloseResume} />
              </>
            )}
            <br />
            <br />

            {isEditing ? (
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveChanges}
                  sx={{ marginRight: "330px" }}
                  disabled={!save}
                >
                  Save Changes
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGoBack}
                  sx={{
                    position: "absolute",
                  }}
                >
                  Go Back
                </Button>
              </div>
            ) : (
              <Button variant="contained" onClick={handleEditClick}>
                Edit Profile
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default UserProfile;

import {
  Typography,
  Box,
  Grid,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Link } from 'react-router-dom';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Stack } from "@mui/system";
import React from "react";
import StatComponent from "../../components/StatComponent";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WorkIcon from "@mui/icons-material/Work";
import { useSelector } from "react-redux";
import moment from "moment";
import ChartComponent from "../../components/ChartComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import UserBarChart from "./UserBarChart";
import { isMobile } from "react-device-detect";

const UserDashboard = () => {
  const { user } = useSelector((state) => state.userProfile);
  const [barChartData, setBarChartData] = useState([]);
  const userID = user ? user._id : "";
  useEffect(() => {
    console.log("Inside use Effect");

    axios
      .get(`/api/users/${userID}`)
      .then((response) => {
        console.log("Response 3", response);
        setBarChartData(response.data);
      })
      .catch((error) => console.error("Error :", error));
  }, [userID]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        padding: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#E0E7EC",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginTop: "20px",
          padding: "20px",
        }}
      >
        <Grid container justifyContent="center" spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <StatComponent
                value={user && moment(user.createdAt).format("MMMM D, YYYY")}
                icon={
                  <Link to='/userProfile'><CalendarMonthIcon
                    sx={{ color: "#00008B", fontSize: { xs: 24, sm: 30 } }}
                  /></Link>
                }
                description="Member Since"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <StatComponent
                value={user?.jobHistory.length}
                icon={
                  <Link to='/user/jobs'><WorkIcon
                    sx={{ color: "#00008B", fontSize: { xs: 24, sm: 30 } }}
                  /></Link>
                }
                description="Jobs Applied"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={10} md={8}>
            {barChartData.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <ChartComponent>
                  <Typography
                    variant={{ xs: "subtitle1", sm: "h6" }}
                    textAlign="center"
                    sx={{ fontWeight: 'bold' }}
                  >
                    Jobs applied for the past 7 days
                  </Typography>
                  <UserBarChart data={barChartData} height={300} />
                </ChartComponent>
              </motion.div>
            ) : (

              <div style={{ textAlign: "center" }}>
              <Typography variant={{ xs: "subtitle1", sm: "h6" }}>
                No Jobs Applied for the past 7 days
              </Typography>
            </div>

              // <Accordion sx={{ width: "100%" ,marginTop:5,}}>
              //   <AccordionSummary
              //     expandIcon={<ExpandMoreIcon />}
              //     aria-controls="job-details-content"
              //     id="job-details-header"
              //   >
              //     <Typography variant="body1" textAlign="center" >
              //       Terms and Condition
              //     </Typography>
              //   </AccordionSummary>
              //   <AccordionDetails>
              //     <Typography variant="body2" sx={{ marginTop: 2 }}>
              //       <strong>1. Job Postings</strong>
              //     </Typography>
              //     <Typography
              //       variant="body2"
              //       sx={{ marginTop: 1, marginLeft: 2 }}
              //     >
              //       - Employers are responsible for the accuracy of job
              //       postings.
              //     </Typography>
              //     <Typography
              //       variant="body2"
              //       sx={{ marginTop: 1, marginLeft: 2 }}
              //     >
              //       - Job seekers must not provide false information in their
              //       profiles.
              //     </Typography>
              //     <Typography variant="body2" sx={{ marginTop: 2 }}>
              //       <strong>2. Job Searches</strong>
              //     </Typography>
              //     <Typography
              //       variant="body2"
              //       sx={{ marginTop: 1, marginLeft: 2 }}
              //     >
              //       - Job seekers are responsible for applying to jobs that
              //       match their qualifications.
              //     </Typography>
              //     <Typography variant="body2" sx={{ marginTop: 2 }}>
              //       <strong>3. Privacy Policy</strong>
              //     </Typography>
              //     <Typography
              //       variant="body2"
              //       sx={{ marginTop: 1, marginLeft: 2 }}
              //     >
              //       - Your use of our job portal is also governed by our Privacy
              //       Policy.
              //     </Typography>
              //   </AccordionDetails>
              // </Accordion>
            )}
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default UserDashboard;

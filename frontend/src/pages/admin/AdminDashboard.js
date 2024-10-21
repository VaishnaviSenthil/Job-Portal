import { Box, Stack, Typography } from "@mui/material";
import StatComponent from "../../components/StatComponent";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import WorkIcon from "@mui/icons-material/Work";
import ChartComponent from "../../components/ChartComponent";
import React, { useState, useEffect } from "react";
import axios from "axios";
import BarGraphComponent from "../../components/BarGraphComponent";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [usersWithJobHistory, setUsersWithJobHistory] = useState(0);
  const [totalJobsPosted, setTotalJobsPosted] = useState(0);
  const [barChartData, setBarChartData] = useState([]);
  const [users, setUsers] = useState({});
  const [weekType, setWeekType] = useState("");

  useEffect(() => {
    console.log("Inside use Effect");

    axios
      .get("/api/jobsPostedOnDate")
      .then((response) => {
        console.log("Response 3", response);
        setBarChartData(response.data.data);
        setWeekType(response.data.weekType);
      })
      .catch((error) => console.error("Error :", error));

    axios
      .get("/api/appliedUsers")
      .then((response) => {
        setUsersWithJobHistory(response.data.length);
      })
      .catch((error) => console.error("Error ", error));

    axios
      .get("/api/jobs/showAll")
      .then((response) => {
        setTotalJobsPosted(response.data.jobs.length);
      })
      .catch((error) =>
        console.error("Error fetching users with job history:", error)
      );

    axios
      .get("/api/appliedUsers/status")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) =>
        console.error("Error fetching users with job history:", error)
      );
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          maxHeight="100vh"
          overflow="hidden"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 1, md: 5 }}
            width="100%"
          >
            <StatComponent
              value={usersWithJobHistory}
              icon={
                <SupervisorAccountIcon
                  sx={{ color: "#fafafa", fontSize: 20 }}
                />
              }
              description="Applied Users"
              money=""
            />
            <StatComponent
              value={totalJobsPosted}
              icon={<WorkIcon sx={{ color: "#fafafa", fontSize: 20 }} />}
              description="Jobs Posted"
              money=""
            />

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                gap={"10px"}
                marginR
              >
                <Box bgcolor="#ff9800" color="#fff" p={2} borderRadius={4}>
                  <Typography variant="h6">Pending</Typography>
                  <Typography variant="h4">{users.pending}</Typography>
                </Box>
                <Box bgcolor="#4caf50" color="#fff" p={2} borderRadius={4}>
                  <Typography variant="h6">Accepted</Typography>
                  <Typography variant="h4">{users.accepted}</Typography>
                </Box>
                <Box bgcolor="#f44336" color="#fff" p={2} borderRadius={4}>
                  <Typography variant="h6">Rejected</Typography>
                  <Typography variant="h4">{users.rejected}</Typography>
                </Box>
              </Box>
            </motion.div>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{ mt: 3 }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <ChartComponent>
                <Typography variant="h6" textAlign="center" sx={{ fontWeight: 'bold' }} >
                Jobs posted 
                  {" "}{weekType === "currentWeek"
                    ? "last 7 days"
                    : "previous 7 days"}
                  
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1, sm: 1, md: 1 }}
                >
                  <Typography variant="body1">
                    {barChartData.length > 0 && (
                      <BarGraphComponent data={barChartData} />
                    )}
                  </Typography>
                </Stack>
              </ChartComponent>
            </motion.div>
          </Stack>
        </Box>
      </motion.div>
    </>
  );
};

export default AdminDashboard;

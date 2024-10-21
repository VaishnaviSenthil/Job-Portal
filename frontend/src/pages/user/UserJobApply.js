import React, { useEffect, useState } from "react";

import {
  Box,
  Card,
  Container,
  Pagination,
  ListItemIcon,
  MenuItem,
  Button,
  MenuList,
  Stack,
  Typography,
  useTheme,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { jobLoadAction } from "../../redux/actions/jobActions";
import { Link, useParams } from "react-router-dom";
import CardElement from "../../components/CardElement";
import LoadingBox from "../../components/LoadingBox";
import SelectJob from "../../components/SelectJob";
import { jobTypeLoadAction } from "../../redux/actions/jobTypeAction";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchBar from "../../components/SearchBar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IconButton } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";
import { isMobile } from "react-device-detect";
import { toast } from "react-toastify";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";

const UserJobApply = () => {
  const { jobs, setUniqueLocation, pages, loading } = useSelector(
    (state) => state.loadJobs
  );

  const { palette } = useTheme();
  const dispatch = useDispatch();
  const { keyword, location } = useParams();

  const [page, setPage] = useState(1);
  const [cat, setCat] = useState("");
  const [viewAll, setViewAll] = useState(false);
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [recommandedJobs, setRecommandedJobs] = useState([]);
  const [showRecommendedJobs, setShowRecommendedJobs] = useState(false);

  useEffect(() => {
    dispatch(jobLoadAction(page, keyword, cat, location));
    setViewAll(true);
  }, [page, keyword, cat, location]);

  useEffect(() => {
    dispatch(jobTypeLoadAction());
  }, []);

  const fetchRecommandation = async () => {
    try {
      const response = await axios.get(`/api/recomandation`);
      setRecommandedJobs(response.data);
    } catch (error) {
      console.error("Error fetching recommended jobs:", error);
    }
  };

  useEffect(() => {
    fetchRecommandation();
  }, []);

  useEffect(() => {
    fetchRecommandation();
  }, []);

  const handleChangeCategory = (e) => {
    setCat(e.target.value);
  };
  const handleView = () => {
    navigate("/user/apply/jobs");
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (window.pageYOffset > 300) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  useEffect(() => {
    // Listen for scroll events
    window.addEventListener("scroll", handleScroll);
    return () => {
      // Clean up the event listener on component unmount
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleRecommendedJobs = () => {
    setShowRecommendedJobs(!showRecommendedJobs);
  };

  return (
    <>
      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
        <Container>
          <br />
          <Box
            sx={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
               
              }}
            >
              <SearchBar sx={{ width: isMobile ? "100%" : "auto", flex: 1 }} />
              {isMobile && (
                <Tooltip title="View All">
                 
                 <div style={{ marginRight: '-10px', marginTop:'5px' }}>
        <RotateLeftIcon onClick={handleView} fontSize="large" style={{ color: '#0277BD' }} />
      </div>
                 
                </Tooltip>
              )}
            </div>
            {!isMobile && (
              <Button
                color="primary"
                sx={{
                  width: "120px",
                  height: "30px",
                  marginTop: 1,
                  marginLeft: 16,
                }}
                variant="contained"
                onClick={handleView}
              >
                <Tooltip title="View all jobs">View All</Tooltip>
              </Button>
            )}
            {!isMobile && (
              <div
                style={{
                  marginTop: isMobile ? 10 : 8,
                  marginLeft: isMobile ? 20 : 16,
                }}
              >
                <Tooltip title="Recommended Jobs">
                  <Button
                    color="primary"
                    sx={{
                      width: isMobile ? "50%" : "auto",
                      height: "30px",
                    }}
                    variant="contained"
                    onClick={toggleRecommendedJobs}
                  >
                    {showRecommendedJobs ? "Hide" : "Recommended Job"}
                  </Button>
                </Tooltip>
              </div>
            )}
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Box sx={{ flex: 2 }}>
              <Card sx={{ minWidth: 150, mb: 3, mt: 3, p: 2 }}>
                <Box sx={{ pb: 2 }}>
                  <Typography
                    component="h4"
                    sx={{ color: palette.secondary.main, fontWeight: 600 }}
                  >
                    Filter job by category
                  </Typography>
                </Box>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                >
                  <SelectJob
                    handleChangeCategory={handleChangeCategory}
                    cat={cat}
                  />
                </motion.div>
              </Card>

              {isMobile ? null : (
                <Card
                  sx={{
                    minWidth: 150,
                    mb: 3,
                    mt: 3,
                    p: 2,
                    bgcolor: palette.primary.white,
                  }}
                >
                  <Box sx={{ pb: 2 }}>
                    <Typography
                      component="h4"
                      sx={{ color: palette.secondary.main, fontWeight: 600 }}
                    >
                      Filter job by location
                    </Typography>
                    <MenuList>
                      {setUniqueLocation &&
                        setUniqueLocation.map((location, i) => (
                          <MenuItem key={i}>
                            <ListItemIcon>
                              <LocationOnIcon
                                sx={{
                                  color: palette.secondary.main,
                                  fontSize: 18,
                                }}
                              />
                            </ListItemIcon>
                            <Link
                              style={{ color: palette.secondary.main }}
                              to={`/search/loc/${location}`}
                            >
                              {location}
                            </Link>
                          </MenuItem>
                        ))}
                    </MenuList>
                  </Box>
                </Card>
              )}
            </Box>
            {isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* <Tooltip title="View All">
                <Button
                  color="primary"
                  sx={{
                    width: "auto", // Change the width to auto
                    height: "30px",
                  }}
                  variant="contained"
                  onClick={handleView}
                >
                  <RotateLeftIcon />
                </Button>
                </Tooltip> */}
                <Tooltip title="Recommended Jobs">
                  <Button
                    color="primary"
                    sx={{
                      width: "auto",
                      height: "30px",
                      marginLeft: 1,
                    }}
                    variant="contained"
                    onClick={toggleRecommendedJobs}
                  >
                    {showRecommendedJobs ? "Hide" : "Recommended Jobs"}
                  </Button>
                </Tooltip>
              </Box>
            )}

            <Box sx={{ flex: 5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack spacing={0}>
                  {!showRecommendedJobs && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 1,
                      }}
                    >
                      <Typography
                        variant={isMobile ? "body1" : "h5"}
                        sx={{
                          mr: isMobile ? 0 : 0,
                        }}
                      >
                        All Jobs
                      </Typography>
                      {!showRecommendedJobs && (
                        <Pagination
                          page={page}
                          count={pages === 0 ? 1 : pages}
                          siblingCount={0}
                          color="secondary"
                          onChange={(event, value) => setPage(value)}
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            marginLeft: isMobile ? 1 : 33,
                          }}
                        />
                      )}
                    </Box>
                  )}
                </Stack>
              </Box>

              {showRecommendedJobs ? (
                <div style={{minWidth:"100%"}}>
                  <Typography variant="h5">Recommended Jobs</Typography>
                  {recommandedJobs.length === 0 ? (
                    <p>No jobs for your skills found</p>
                  ) : (
                    recommandedJobs.map((job, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: i * 0.7 }}
                      >
                        <CardElement
                          key={i}
                          id={job._id}
                          jobTitle={job.title}
                          description={job.description}
                          category={
                            job.jobType ? job.jobCategory : "No category"
                          }
                          location={job.location}
                        />
                      </motion.div>
                    ))
                  )}
                </div>
              ) : null}

              {loading ? (
                <LoadingBox />
              ) : jobs && jobs.length === 0 ? (
                <>
                  <Box
                    sx={{
                      minHeight: "350px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h2>No result found!</h2>
                  </Box>
                </>
              ) : (
                !showRecommendedJobs && (
                  <div>
                    {jobs &&
                      jobs.map((job, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: i * 0.7 }}
                        >
                          <CardElement
                            key={i}
                            id={job._id}
                            jobTitle={job.title}
                            description={job.description}
                            category={
                              job.jobType ? job.jobCategory : "No category"
                            }
                            location={job.location}
                            company={job.company}
                            skills={job.skills}
                            salary={job.salary}

                          />
                        </motion.div>
                      ))}
                  </div>
                )
              )}
              {!showRecommendedJobs && (
                <Stack spacing={2}>
                  <Pagination
                    page={page}
                    count={pages === 0 ? 1 : pages}
                    siblingCount={0}
                    color="secondary"
                    onChange={(event, value) => setPage(value)}
                  />
                </Stack>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>

      {showScrollTop && (
        <Tooltip title="Scroll to Top"><IconButton
          onClick={handleScrollToTop}
          style={{
            backgroundColor: "#3f51b5", // Change the background color
            borderRadius: "50%", // Make it circular
            padding: "8px", // Add some padding
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
          aria-label="Scroll to top"
        >
          <KeyboardArrowUpIcon style={{ color: "#ffffff" }} />{" "}
        </IconButton></Tooltip>
      )}
    </>
  );
};

export default UserJobApply;

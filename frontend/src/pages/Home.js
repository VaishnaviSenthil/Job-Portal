import React from "react";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import {
  Box,
  Card,
  Container,
  ListItemIcon,
  MenuItem,
  MenuList,
  Pagination,
  Stack,
  Typography,
  useTheme,
  Tooltip
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { jobLoadAction } from "../redux/actions/jobActions";
import { Link, useParams } from "react-router-dom";
import CardElement from "../components/CardElement";
import Footer from "../components/Footer";
import LoadingBox from "../components/LoadingBox";
import SelectJob from "../components/SelectJob";
import { jobTypeLoadAction } from "../redux/actions/jobTypeAction";
import { motion } from "framer-motion";
import axios from "axios";
import { IconButton } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CompanyCardsSlider from './CompanyCardsSlider';


const Home = () => {
  const { jobs, setUniqueLocation, pages, loading } = useSelector(
    (state) => state.loadJobs
  );
  console.log("InHome")
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { keyword, location } = useParams();
  const [page, setPage] = useState(1);
  const [cat, setCat] = useState("");

  const [companyJobs, setCompanyJobs] = useState([]);

  // Function to fetch company data
  const fetchCompanyJobs = async () => {
    try {
      const response = await axios.get("/api/jobs/company");
      setCompanyJobs(response.data);
    } catch (error) {
      console.error("Error fetching company jobs:", error);
    }
  };

  useEffect(() => {
    dispatch(jobLoadAction(page, keyword, cat, location));
    fetchCompanyJobs();
  }, [page, keyword, cat, location]);

  useEffect(() => {
    dispatch(jobTypeLoadAction());
  }, []);

  const handleChangeCategory = (e) => {
    setCat(e.target.value);
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box sx={{ bgcolor: "white", minHeight: "100vh" }}>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <NavBar />
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Header />
          </motion.div>
          <CompanyCardsSlider companyJobs={companyJobs} />
          <Container>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2, md: 4 }}
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Box sx={{ flex: 2, padding: 2 }}>
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
                        Filter job by category
                      </Typography>
                    </Box>

                    <SelectJob
                      handleChangeCategory={handleChangeCategory}
                      cat={cat}
                    />
                  </Card>

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
                                to={`/search/location/${location}`}
                              >
                                {location}
                              </Link>
                            </MenuItem>
                          ))}
                      </MenuList>
                    </Box>
                  </Card>
                </Box>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Box sx={{ flex: 5, padding: 2 }}>
                  

                  <Stack spacing={2}>
                    <Pagination
                      color="primary"
                      variant="outlined"
                      page={page}
                      count={pages === 0 ? 1 : pages}
                      onChange={(event, value) => setPage(value)}
                    />
                  </Stack>
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
                    jobs &&
                    jobs.map((job, i) => (
                      <CardElement
                        key={i}
                        id={job._id}
                        jobTitle={job.title}
                        description={job.description}
                        category={
                          job.jobType ? job.jobType.jobType : "No category"
                        }
                        location={job.location}
                      />
                    ))
                  )}
                  <Stack spacing={2}>
                    <Pagination
                      color="primary"
                      variant="outlined"
                      page={page}
                      count={pages === 0 ? 1 : pages}
                      onChange={(event, value) => setPage(value)}
                    />
                  </Stack>
                </Box>
              </motion.div>
            </Stack>
          </Container>
        </Box>
      </motion.div>

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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Footer />
      </motion.div>
    </>
  );
};

export default Home;

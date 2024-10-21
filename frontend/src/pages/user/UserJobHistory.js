import React, { useState, useEffect } from "react";
import {
  Box,
  Select,
  MenuItem,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import noContent from "../../images/noContent.jpg";
import LoadingBox from "../../components/LoadingBox";
import JobCard from "../../components/JobsCard";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import DownloadIcon from "@mui/icons-material/Download";

const UserJobHistory = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userProfile);
  const [totalPages, setTotalPages] = useState(1);
  const [jobHistory, setJobHistory] = useState([]);
  const [cur, setCur] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleToggleFavorites = () => {
    setShowFavorites(!showFavorites);
    setStatus("");
    setCur(1);
  };

  const handlePageChange = (event, newPage) => {
    setCur(newPage);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setCur(1);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `/api/userProfile?applicationStatus=${status}&page=${cur}&showFavorites=${showFavorites}`
      );
      const { jobHistory, totalPages, currentPage } = response.data;
      setJobHistory(jobHistory);
      setTotalPages(totalPages);
      setLoading(false);
      if (jobHistory.length === 0) {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [cur, status, showFavorites]);

  const handleGeneratePDF = () => {
    axios
      .get(`/api/generatePdf/${user._id}?applicationStatus=${status}`, {
        responseType: "blob",
      })
      .then((response) => {
        if (response.status === 204) {
          toast.error("No Content to generate pdf");
          return;
        }

        setOpenDialog(false);

        const url = URL.createObjectURL(response.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = `my_applied_jobs.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => console.error("Error generating PDF:", error));
  };

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          startIcon={<DownloadIcon />}
        >
          History
        </Button>
        <Pagination
          count={totalPages}
          page={cur}
          onChange={handlePageChange}
          shape="rounded"
          sx={{
            display: "flex",
            justifyContent: "center",
            color: "#fff",
            backgroundColor: "lightgray",
            width: "19%",
            height: "30px",
            borderRadius: "5px",
          }}
        />
        <Box display="flex" alignItems="center">
          <Select
            label="Status"
            value={status}
            onChange={handleStatusChange}
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: "5px",
              padding: "0",
              minWidth: "110px",
              maxHeight: "38px",
              marginRight: "16px",
            }}
            displayEmpty
            inputProps={{ shrink: false }}
            style={{ "&:focus": { border: "none" } }}
          >
            <MenuItem value="" disabled={status === ""}>
              All
            </MenuItem>
            <MenuItem value="Accepted" disabled={status === "Accepted"}>
              Accepted
            </MenuItem>
            <MenuItem value="Rejected" disabled={status === "Rejected"}>
              Rejected
            </MenuItem>
            <MenuItem value="Pending" disabled={status === "Pending"}>
              Pending
            </MenuItem>
          </Select>

          <Button variant="contained" onClick={handleToggleFavorites}>
            {showFavorites ? "Show All Jobs" : "Show Favorites"}
          </Button>
        </Box>
      </Box>
      <br />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Download PDF Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to download the PDF of your job history?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant='contained' color="secondary">
            No
          </Button>
          <Button onClick={handleGeneratePDF} variant='contained' color="success" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Box display="flex" flexWrap="wrap" gap={3} sx={{ ml: 10 }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              background: "rgba(255, 255, 255, 0.7)",
              zIndex: 1,
            }}
          >
            <LoadingBox />
          </div>
        ) : jobHistory.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <img
              src={noContent}
              alt="No content"
              style={{ width: "500px", height: "350px" }}
            />
          </div>
        ) : (
          jobHistory.map((history) => (
            <JobCard
              key={history._id}
              id={history._id}
              jobTitle={history.title}
              company={history.company}
              location={history.location}
              salary={history.salary}
              status={history.applicationStatus}
              createdAt={history.createdAt}
              favorite={history.favorite}
            />
          ))
        )}
      </Box>
    </div>
  );
};

export default UserJobHistory;

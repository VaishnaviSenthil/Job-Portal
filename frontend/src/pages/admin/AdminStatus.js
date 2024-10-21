import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  IconButton,
} from "@mui/material";
import ApplicationStatusDropdown from "../../components/ApplicationStatusDropdown";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

import EditIcon from "@mui/icons-material/Edit";
import ApprovalIcon from "@mui/icons-material/Approval";
import ResumeViewer from "./ResumeViewer";
import moment from "moment";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useNavigate } from "react-router-dom";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import noContentImage from "../../images/noContent.jpg";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import LoadingBox from "../../components/LoadingBox";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";

const AdminStatus = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [filterOption, setFilterOption] = useState("date");
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [openDialog1, setOpenDialog1] = useState(false);
  const [updated,setUpdate]=useState(false);

  const handleOpenDialog1 = () => {
    setOpenDialog1(true);
  };

  const handleCloseDialog1 = () => {
    setOpenDialog1(false);
  };

  const CustomDataGrid = styled(DataGrid)`
    .header-bold {
      font-weight: bold;
      font-size: 16px; // Adjust the font size as needed
    }
  `;

  const handleFilterOptionChange = (event) => {
    setFilterOption(event.target.value);
  };

  const handleViewAppliedJobs = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

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
        toast.error("User did not submit a Resume");
      }
    } catch (error) {
      console.error("Error fetching the file:", error);
    }
  };

  useEffect(() => {
    const fetchAppliedUsers = async () => {
      try {
        const response = await axios.get(
          `/api/appliedUsers?title=${title}&company=${company}&startDate=${startDate}&endDate=${endDate}`
        );
        const data = await response.data;
        setUsers(data);
        setLoading(false);
        setTitle("");
        setCompany("");
        setStartDate("");
        setEndDate("");
      } catch (error) {
        console.error("Error fetching applied users:", error.response);
        toast.error(error.response.data.message)
      }
    };

    fetchAppliedUsers();
  }, [filtering,updated]);


  const handleGoBack = () => {
    setFiltering(false);
  };

  const handleFilter = () => {
    setFiltering(true);
    console.log("Called !!!");
    setOpenDialog(false);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
  };

  // Function to handle opening the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const reloadPage = () => {
    window.location.reload(true);
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleGeneratePDF = async () => {
    try {
      const response = await axios.get(`/api/generateAllUserReports`, {
        responseType: "blob", // Important: Set the response type to 'blob'
      });
      setOpenDialog1(false);

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "user_reports.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDFs:", error);
    }
  };
  const updateApplicationStatus = (userId, jobHistoryId, newStatus) => {
    // Find the user and job history entry to update
    const updatedUsers = users.map((user) => {
      if (user._id === userId) {
        const updatedJobHistory = user.jobHistory.map((job) => {
          if (job._id === jobHistoryId) {
            return { ...job, applicationStatus: newStatus };
          }
          return job;
        });
        return { ...user, jobHistory: updatedJobHistory };
      }
      return user;
    });
    console.log("CALLED");
    setUpdate(!updated);
    setOpen(false);
    console.log("CALLED 2");
    setOpen(true);
    
    setUsers(updatedUsers); 

  };

  const columns = [
    {
      field: "firstName",
      headerName: "Applicant Name",
      headerClassName: "header-bold",
      width: 140,
    },
    {
      field: "state",
      headerName: "Location",
      headerClassName: "header-bold",
      width: 100,
    },
    {
      field: "skills",
      headerName: "Skills",
      headerClassName: "header-bold",
      headerAlign: "center",
      width: 220,
    },
    {
      field: "experience",
      headerName: "Experience",
      width: 100,
      headerClassName: "header-bold",
      renderCell: (params) => (
        <Typography
          style={{
            backgroundColor: params.row.experience >= 2 ? "green" : "red",
            color: "#fff",
            padding: "6px",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          {params.row.experience}{" "}
          {params.row.experience >= 2 ? "years" : " year"}
        </Typography>
      ),
    },
    {
      field: "Actions",
      headerName: "Applicant Resume",
      width: 180,
      headerClassName: "header-bold",

      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Applicant Resume"><Button
            onClick={() => handleResume(params.row.resumePath)}
            variant="outlined"
            color="primary"
            sx={{ color: "#007bff", borderColor: "#007bff" }}
            startIcon={
              <RemoveRedEyeIcon
                fontSize="small"
                sx={{ marginRight: "5px", color: "#2196F3" }}
              />
            }
          >
            View Resume
          </Button> </Tooltip>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "View Applied Jobs",
      headerClassName: "header-bold",
      width: 200,
      renderCell: (params) => (
        <Tooltip title="Applicant applied jobs"><Button
          onClick={() => handleViewAppliedJobs(params.row)}
          variant="outlined"
          sx={{ color: "#007bff", borderColor: "#007bff" }}
          startIcon={
            <ApprovalIcon fontSize="small" sx={{ color: "#2196F3" }} />
          }
        >
          View Applied Jobs
        </Button></Tooltip>
      ),
    },
  ];

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpenDialog1}
        sx={{ backgroundColor: "#4CAF50", color: "#fff" }}
        startIcon={<FileDownloadIcon />}
      >
        Users Report
      </Button>
      <Dialog open={openDialog1} onClose={handleCloseDialog1}>
        <DialogTitle style={{ color: "blue" }}>
          Download PDF Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: "#444" }}>
            Are you sure you want to download the all users report as zip file?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog1}
            variant="contained"
            color="secondary"
          >
            No
          </Button>
          <Button
            onClick={handleGeneratePDF}
            variant="contained"
            color="success"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="contained"
        onClick={handleOpenDialog}
        sx={{ marginLeft: 3, backgroundColor: "#2196F3", color: "#fff" }}
      >
        <FilterAltOffIcon />- Filter
      </Button>
      {filtering && (
        <Button
          variant="contained"
          onClick={handleGoBack}
          sx={{ marginLeft: 75, backgroundColor: "#2196F3", color: "#fff" }}
        >
          <ArrowBackIcon />
        </Button>
      )}
      ;
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Filter Candidates</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              bgcolor: "white",
              borderRadius: 4,
              p: 2,
              maxWidth: "570px",
            }}
          >
            <Select
              value={filterOption}
              onChange={handleFilterOptionChange}
              sx={{ marginBottom: 1 }}
            >
              <MenuItem value="date">Filter by Date</MenuItem>
              <MenuItem value="titleCompany">
                Filter by Job-Role and Company
              </MenuItem>
            </Select>
            {filterOption === "date" && (
              <>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </>
            )}

            {filterOption === "titleCompany" && (
              <>
                <TextField
                  label="Job-Role"
                  value={title}
                  onChange={handleTitleChange}
                  sx={{ marginBottom: 1 }}
                />
                <TextField
                  label="Company"
                  value={company}
                  onChange={handleCompanyChange}
                  sx={{ marginBottom: 1 }}
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={filterOption === "date" ? handleFilter : handleFilter}
            color="info"  variant="contained"
          >
            {filterOption === "date" ? "Filter By Date" : "Search"}
          </Button>
          <Button onClick={handleCloseDialog}  variant="contained" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {fileUrl && (
        <ResumeViewer fileUrl={fileUrl} onClose={handleCloseResume} />
      )}
      <br />
      <br />
      <Box display="flex" flexWrap="wrap" maxHeight="60vh">
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
        ) : users.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={noContentImage}
              alt="No Content"
              style={{ width: "800px", height: "400px", marginLeft: 10 }}
            />
          </div>
        ) : (
          <CustomDataGrid
            rows={users}
            columns={columns}
            pageSize={5}
            rowHeight={75}
            autoHeight
            style={{ backgroundColor: "#fff" }}
            slots={{ toolbar: GridToolbar }}
            getRowId={(row) => row._id}
            // autoPageSize
            pagination
          />
        )}
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedUser
            ? `Applied Jobs for ${selectedUser.firstName} ${selectedUser.lastName}`
            : "Applied Jobs"}

          <IconButton
            edge="end"
            color="error"
            onClick={() => {setOpen(false)}}
            aria-label="close"
            sx={{
              position: "absolute",
              right: "8px",
              top: "8px",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedUser && selectedUser.jobHistory.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Role
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Company
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Applied On
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Application Status
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedUser.jobHistory.map((job) => (
                    <TableRow key={job._id}>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>
                        {moment(job.createdAt).format("DD MMM YYYY")}
                      </TableCell>
                      <TableCell
                        style={{
                          color:
                            job.applicationStatus === "Accepted"
                              ? "green"
                              : job.applicationStatus === "Rejected"
                              ? "red"
                              : "darkOrange",
                        }}
                      >
                        {job.applicationStatus}
                      </TableCell>
                      <TableCell>

                        <ApplicationStatusDropdown
                          userId={selectedUser._id}
                          jobHistoryId={job._id}
                          appStatus={job.applicationStatus}
                          onStatusChange={updateApplicationStatus}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">No job history available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false); }}
            variant="contained"
            color="error"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <br />
    </div>
  );
};

export default AdminStatus;

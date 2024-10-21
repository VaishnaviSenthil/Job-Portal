import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Typography, TextField } from "@mui/material";
// import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { DataGridPro, gridClasses, GridToolbar } from "@mui/x-data-grid-pro";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Papa from "papaparse";
import axios from "axios";
import { toast } from "react-toastify";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import SendIcon from '@mui/icons-material/Send';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import moment from "moment";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadIcon from "@mui/icons-material/Upload";
import { confirmAlert } from "react-confirm-alert"; // Import react-confirm-alert
import "react-confirm-alert/src/react-confirm-alert.css";
import { styled } from "@mui/system";
import {isMobile} from "react-device-detect"
import MobileViewComponents from "./MobileViewComponents";

const AdmJobs = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [send, setSend] = useState(false);
  const [openDialog1, setOpenDialog1] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const confirmDelete = (id) => {
    confirmAlert({
      
      title: "Confirm Delete",
      message: "Are you sure you want to delete this job?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteJobById(id),
          style: { backgroundColor: "red", color: "white" },
        },
        {
          label: "No",
          onClick: () => {},
          style: { backgroundColor: "green", color: "white" },
        },
      ],
    });
  };

  const handleOpenDialog1 = () => {
    setOpenDialog1(true);
  };

  const handleCloseDialog1 = () => {
    setOpenDialog1(false);
  };
  // const { keyword, location,startDate,endDate } = useParams();
  const [filterValues, setFilterValues] = useState({
    keyword: "",
    location: "",
    startDate: "",
    endDate: "",
  });
  const [jobs, setJobs] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/jobs/showAll");
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // const { jobs, loading } = useSelector((state) => state.loadJobs);
  console.log("Jobs ***", jobs);
  let data = [];
  data = jobs !== undefined && jobs.length > 0 ? jobs : [];

  const locations = [
    "Chennai",
    "Bengaluru",
    "Hyderabad",
    "New York NY",
    "Coimbatore",
  ];
  //delete job by Id
  const deleteJobById = async (id) => {
    try {
      const response = await axios.delete(`/api/job/delete/${id}`);
      if (response.data) {
        toast.success("Job status changed to inActive");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(error.response.data.error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  console.log("KEYYYY", filterValues.keyword);

  const generatePdfReport = async () => {
    const apiUrl = `/api/jobs/generatePdf/?keyword=${filterValues.keyword}&location=${filterValues.location}&startDate=${filterValues.startDate}&endDate=${filterValues.endDate}`;

    try {
      axios
        .get(apiUrl, { responseType: "blob" })
        .then((response) => {
          if (response.status === 204) {
            toast.error("No Content to generate pdf");
            return;
          }
          // setOpenDialog1(false);
          const url = URL.createObjectURL(response.data);
          const a = document.createElement("a");
          a.href = url;
          a.download = `jobReport.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        })
        .catch((error) => console.error("Error generating PDF:", error));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenerateReport = () => {
    generatePdfReport();
    setOpenDialog1(false);
    setDialogOpen(false);
    setFilterValues({ keyword: "", location: "", startDate: "", endDate: "" });
  };

  const CustomDataGrid = styled(DataGridPro)`
    .header-bold {
      font-weight: bold;
      font-size: 16px; // Adjust the font size as needed
    }
    .cell-bold {
      font-size: 14px; // Adjust the font size as needed
    }
  `;

  const columns = [
    {
      field: "title",
      headerName: "Job Name",
      width: 150,
      // editable: true,
      headerClassName: "header-bold", // Add this line
      cellClassName: "cell-bold",
    },
    {
      field: "company",
      headerName: "Company",
      width: 150,
      // editable: true,
      headerClassName: "header-bold", // Add this line
      cellClassName: "cell-bold",
    },
    {
      field: "jobType",
      headerName: "Category",
      width: 100,
      valueGetter: (data) => data.row.jobType.jobType,
      // editable: true,
      headerClassName: "header-bold", // Add this line
      cellClassName: "cell-bold",
    },

    {
      field: "available",
      headerName: "Available",
      width: 100,
      // editable: true,
      headerClassName: "header-bold", // Add this line
      cellClassName: "cell-bold",
      renderCell: (values) => (values.row.available === true ? "Yes" : "No"),
    },

    {
      field: "salary",
      headerName: "Salary",
      type: Number,
      width: 100,
      headerClassName: "header-bold", // Add this line
      cellClassName: "cell-bold",
      renderCell: (values) => "₹" + values.row.salary,
    },

    {
      field: "deadline",
      headerName: "DeadLine",
      width: 100,
      headerClassName: "header-bold", // Add this line
      cellClassName: "cell-bold",
      renderCell: (params) => moment(params.row.deadline).format("YYYY-MM-DD"),
    },
    {
      field: "jobCategory",
      headerName: "Job Mode",
      width: 100,
      headerClassName: "header-bold", // Add this line
      cellClassName: "cell-bold",
    },

    {
      field: "Actions",
      width: 150,
      headerAlign: "center",
      headerClassName: "header-bold",
      // cellClassName: 'cell-bold',
      renderCell: (values) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "150px",
          }}
        >
          <Button variant="contained">
            <Link
              style={{ color: "white", textDecoration: "none" }}
              to={`/admin/edit/job/${values.row._id}`}
            >
              <EditTwoToneIcon />
            </Link>
          </Button>
          <Button
            onClick={(e) => confirmDelete(values.row._id)}
            variant="contained"
            color="error"
          >
            <DeleteTwoToneIcon />
          </Button>
        </Box>
      ),
    },
  ];
  console.log(filterValues);

  const [csvData, setCsvData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        setCsvData(result.data);
      },
    });
    setSend(true);
  };

  const handleUpload = () => {
    // Send csvData to the backend
    axios
      .post("/api/upload", { data: csvData })
      .then((response) => {
        toast.success("Job profiles created successfully");
        setSend(false);
        console.log("Data uploaded successfully:", response.data);
      })
      .catch((error) => {
        toast.error("Error in creating job profiles");
        console.error("Error uploading data:", error);
      });
  };

  return (
    <>{isMobile ?<MobileViewComponents data={data}/> :(
    <Box>
      <div style={{ marginBottom: 20, position: "relative" }}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          id="csv-upload"
        />
        <label htmlFor="csv-upload">
          <Button
            variant="contained"
            component="span"
            style={{
              marginRight: 10,
              backgroundColor: "#2196F3",
              color: "#fff",
            }}
            startIcon={<UploadIcon />}
          >
            JOBS CSV
          </Button>
        </label>

        {send && (
          <Button
            variant="contained"
            component="span"
            style={{
              marginRight: 10,
              backgroundColor: "#2196F3",
              color: "#fff",
            }}
            onClick={handleUpload}
            endIcon={<SendIcon  fontSize="small"/>}
          >
            Send
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          style={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            position: "absolute",
            right: 20,
          }}
          startIcon={<FileDownloadIcon />}
        >
          Jobs Report PDF
        </Button>
      </div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs">
        <DialogTitle>Generate Report</DialogTitle>
        <DialogContent>
          <TextField
            name="keyword"
            label="Job Role"
            value={filterValues.keyword}
            onChange={handleChange}
            sx={{ marginRight: 2, maxWidth: "180px" }}
          />
          <Select
            name="location"
            label="Location"
            displayEmpty
            inputProps={{ "aria-label": "Job Location" }}
            value={filterValues.location}
            onChange={handleChange}
            sx={{ marginRight: 2, minWidth: "120px" }}
          >
            <MenuItem value="" disabled>
              <em>Job Location</em>
            </MenuItem>
            {locations.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </Select>
          <TextField
            name="startDate"
            label="Start Date"
            type="date"
            value={filterValues.startDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginRight: 2, marginTop: 3 }}
          />
          <TextField
            name="endDate"
            label="End Date"
            type="date"
            value={filterValues.endDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginRight: 2, marginTop: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={handleOpenDialog1}
          >
            Generate PDF
          </Button>
          <Button variant="contained" color="error" onClick={handleCloseDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog1} onClose={handleCloseDialog1}>
        <DialogTitle style={{ color: "blue" }}>
          Download PDF Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: "#444" }}>
            Are you sure you want to download the jobs as pdf file?
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
            onClick={handleGenerateReport}
            variant="contained"
            color="success"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ pb: 1, display: "flex", justifyContent: "right" }}>
        <Button
          variant="contained"
          color="success"
          sx={{ marginRight: 2.5 }}
          startIcon={<AddIcon />}
        >
          <Link
            style={{ color: "white", textDecoration: "none" }}
            to="/admin/job/create"
          >
            Create Job
          </Link>
        </Button>
      </Box>
      <Paper sx={{ bgcolor: "secondary.midNightBlue" }}>
        <Box sx={{ height: 400, width: "100%" }}>
          <CustomDataGrid
            getRowId={(row) => row._id}
            rows={data}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            pagination
            slots={{ toolbar: GridToolbar }}
          />
        </Box>
      </Paper>
    </Box>
    )}</>
  );
};

export default AdmJobs;

import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Box, Typography, Divider, TextareaAutosize } from "@mui/material";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./cutomDataGrid.css";
import { GridCsvExportOptions } from '@mui/x-data-grid';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const MobileViewComponents = ({ data }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false); // State for delete confirmation dialog
  const [jobIdToDelete, setJobIdToDelete] = useState(null);
  const columns = [
    {
      field: "title",
      headerName: "Role",
      width: 85,
      headerClassName: "custom-header",
      cellClassName: "custom-column",
    },
    {
      field: "company",
      headerName: "Company",
      width: 101,
      headerClassName: "custom-header",
      cellClassName: "custom-column",
    },
    {
      field: "viewMore",
      headerName: "View",
      width: 75,
      headerClassName: "custom-header",
      cellClassName: "custom-column",
      renderCell: (params) => (
        <VisibilityIcon
          style={{ color: "#0277BD", cursor: "pointer", marginLeft: 14 }}
          onClick={() => handleViewMore(params.row)}
        />
      ),
    },
  ];

  const handleViewMore = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (job) => {
    navigate(`/admin/edit/job/${job._id}`);
  };

  const openDeleteConfirmation = (jobId) => {
    console.log("Called");
    setJobIdToDelete(jobId);
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const confirmDelete = () => {
    // Close the confirmation dialog
    closeDeleteConfirmation();

    // Delete the selected job by ID
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

    deleteJobById(jobIdToDelete);
  };

  return (
    <div>
      <Box sx={{ height: 600, width: "100%", backgroundColor: "white" }}>
        <DataGrid
          getRowId={(row) => row._id}
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          disableColumnMenu
          components={{
            Toolbar: GridToolbar,
          }}
          GridCsvExportOptions={{
            fileName: 'jobsList',
            delimiter: ',',
            utf8WithBom: true,
          }}
          showToolbar
        />
      </Box>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            backgroundColor: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 400,
            p: 2,
          }}
        >
          <Typography variant="h6">Job Details</Typography>
          <Divider sx={{ my: 2 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "120px" }}>
                <strong>Job Name:</strong>
              </div>
              <div>{selectedJob ? selectedJob.title : ""}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "120px" }}>
                <strong>Company:</strong>
              </div>
              <div>{selectedJob ? selectedJob.company : ""}</div>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "120px" }}>
                <strong>Skills:</strong>
              </div>
              <div>{selectedJob ? selectedJob.skills : ""}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "120px" }}>
                <strong>Salary:</strong>
              </div>
              <div>₹ {selectedJob ? selectedJob.salary : ""}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "120px" }}>
                <strong>Category:</strong>
              </div>
              <div>{selectedJob ? selectedJob.jobCategory : ""}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "120px" }}>
                <strong>Deadline:</strong>
              </div>
              <div>
                {selectedJob
                  ? moment(selectedJob.deadline).format("DD MMM YY")
                  : ""}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "110px" }}>
                <strong>Description:</strong>
              </div>
              <div>
                <TextareaAutosize
                  minRows={1}
                  maxRows={1}
                  value={selectedJob ? selectedJob.description : ""}
                  readOnly
                  style={{
                    fontSize: "16px",
                    overflow: "auto",
                    resize:"vertical",
                    fontFamily: "inherit",
                    flex: 1,
                    width:"100%",
                    maxWidth: "120%",
                    marginLeft: "10px",
                    marginTop: "7px",
                  }}
                />
              </div>
            </div>
          </div>

          <Divider sx={{ my: 2 }} />
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleEdit(selectedJob)}
            >
              <EditIcon />
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => openDeleteConfirmation(selectedJob._id)}
              sx={{ marginLeft: 3 }}
            >
              <DeleteIcon />
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseModal}
              sx={{ marginLeft: 8 }}
            >
              Close
            </Button>
          </div>
        </Box>
      </Modal>

      <Dialog open={isDeleteConfirmationOpen} onClose={closeDeleteConfirmation}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this job?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MobileViewComponents;

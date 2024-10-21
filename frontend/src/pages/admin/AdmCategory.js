import React, { useState, useEffect } from "react";
import { Box, Button, Paper, Typography, TextField } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { jobTypeLoadAction } from "../../redux/actions/jobTypeAction";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import axios from "axios";
import { toast } from "react-toastify";
import { styled } from "@mui/system";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const AdmCategory = () => {
  const dispatch = useDispatch();
  const [selectedJobCategory, setSelectedJobCategory] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEdited, setEdited] = useState(false);
  const [dataWithIndex, setDataWithIndex] = useState([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleted, setDeleted] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  useEffect(() => {
    dispatch(jobTypeLoadAction());
  }, [isEdited,isDeleted]);

  const openDeleteConfirmationDialog = (categoryId) => {
    setCategoryIdToDelete(categoryId);
    setDeleteDialogOpen(true);
  };
  const closeDeleteConfirmationDialog = () => {
    setCategoryIdToDelete(null);
    setDeleteDialogOpen(false);
  };

  const CustomDataGrid = styled(DataGrid)`
    .header-bold {
      font-weight: bold;
      font-size: 16px; // Adjust the font size as needed
    }
    .cell-bold {
      font-size: 16px; // Adjust the font size as needed
    }
  `;

  const { jobType, loading } = useSelector((state) => state.jobType);
  let data = [];
  data = jobType !== undefined && jobType.length > 0 ? jobType : [];
  console.log("Dataaaa",data);

  //delete job by Id
  const deleteJobCategoryById = async (id) => {
    try {
      const response = await axios.delete(`/api/type/delete/${id}`);
      if (response.data) {
        setDeleted(!isDeleted);
        setCategoryIdToDelete(null);
        setDeleteDialogOpen(false);
        toast.success("Job Category deleted Successfully");
      }
    } catch (error) {
      console.error("Error deleting job category:", error);
      toast.error(error.response.data.error);
    }
  };

  const editJobCategory = (jobCategory) => {
    setSelectedJobCategory(jobCategory);
    setIsEditDialogOpen(!isEdited);
  };

  const saveJobCategory = async () => {
    try {
      if (selectedJobCategory) {
        const response = await axios.put(
          `/api/type/update/${selectedJobCategory._id}`,
          {
            jobType: selectedJobCategory.jobType,
          }
        );

        if (response.data) {
          toast.success("Job Category updated Successfully");
          setIsEditDialogOpen(false);
          setSelectedJobCategory(null);
          setEdited(true);
        }
      }
    } catch (error) {
      console.error("Error updating job category:", error);
      toast.error(error.response.data.error);
    }
  };

  const cancelEdit = () => {
    setIsEditDialogOpen(false);
    setSelectedJobCategory(null);
  };

  useEffect(() => {
    if (data.length > 0 ) {
      setDataWithIndex(
        data.map((jobCategory, index) => ({
          ...jobCategory,
          index: index + 1,
        }))
      );
    }
  }, [jobType, isEdited,isDeleted]);

  const columns = [
    {
      field: "index",
      headerName: "Index",
      width: 100,
      headerClassName: "header-bold", // Add this line
      cellClassName: "cell-bold",
    },

    {
      field: "jobType",
      headerName: "Category",
      width: 150,
      headerClassName: "header-bold", // Add this line
      cellClassName: "cell-bold",
    },

    {
      field: "Actions",
      width: 200,
      headerClassName: "header-bold",
      headerAlign: "center",
      renderCell: (values) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "170px",
          }}
        >
          <Button
            onClick={() => editJobCategory(values.row)}
            variant="contained"
          >
            <EditTwoToneIcon />
          </Button>
          <Button
            onClick={() => openDeleteConfirmationDialog(values.row._id)}
            variant="contained"
            color="error"
          >
            <DeleteTwoToneIcon />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ pb: 2, display: "flex", justifyContent: "right" }}>
        <Button variant="contained" color="success" startIcon={<AddIcon />}>
          <Link
            style={{ color: "white", textDecoration: "none" }}
            to="/admin/category/create"
          >
            Create Category
          </Link>
        </Button>
      </Box>
      <Box sx={{ pb: 2, display: "flex", justifyContent: "center" }}>
        <Box sx={{ height: 330, width: "50%", backgroundColor: "#f0f0f0" }}>
          <CustomDataGrid
            getRowId={(row) => row._id}
            rows={dataWithIndex}
            columns={columns}
            autoPageSize
            pagination
          />
        </Box>
      </Box>
      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteConfirmationDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this category?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeDeleteConfirmationDialog}
            variant="contained"
            color="secondary"
          >
            No
          </Button>
          <Button
            onClick={() => deleteJobCategoryById(categoryIdToDelete)}
            variant="contained"
            color="error"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isEditDialogOpen} onClose={cancelEdit}>
        <Box p={2}>
          <Typography variant="h6">Edit Job Category</Typography>

          <TextField
            label="Category Name"
            variant="outlined"
            sx={{ mt: 2 }}
            value={selectedJobCategory ? selectedJobCategory.jobType : ""}
            onChange={(e) =>
              setSelectedJobCategory({
                ...selectedJobCategory,
                jobType: e.target.value,
              })
            }
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              onClick={saveJobCategory}
            >
              Save
            </Button>
            <Button variant="contained" onClick={cancelEdit}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AdmCategory;

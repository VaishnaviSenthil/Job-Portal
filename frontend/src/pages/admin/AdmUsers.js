import React, { useEffect } from 'react'
import { Box, Button, IconButton, Paper, Typography } from '@mui/material'
import { DataGrid, gridClasses, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment'
import { allUserAction } from '../../redux/actions/userAction';
import { styled } from '@mui/system';

const AdmUsers = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(allUserAction());
    }, []);


    const { users, loading } = useSelector(state => state.allUsers);
   const data = (users !== undefined && users.length > 0) ? users : [];

    // Add an index field to your data
    const indexedData = data.map((user, index) => ({ index: index + 1, ...user }));

    const CustomDataGrid = styled(DataGrid)`
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
            field: 'index', 
            headerName: 'Index',
            width: 70, 
            headerClassName: 'header-bold', // Add this line
            cellClassName: 'cell-bold',
        },

        {
                field: 'firstName',
                headerName: 'FirstName',
                width: 150,
                headerClassName: 'header-bold', // Add this line
                cellClassName: 'cell-bold',
                
            },
        {
                field: 'lastName',
                headerName: 'LastName',
                width: 120,
                headerClassName: 'header-bold', // Add this line
                cellClassName: 'cell-bold',
                
            },

        {
            field: 'email',
            headerName: 'E_mail',
            width: 180,
            headerAlign: 'center',
            headerClassName: 'header-bold', // Add this line
            cellClassName: 'cell-bold',
        },
        {
            field: 'dateOfBirth',
            headerName: 'Date of Birth',
            width: 120,
            headerClassName: 'header-bold', // Add this line
            cellClassName: 'cell-bold',
            renderCell: (params) => (
                moment(params.row.dateOfBirth).format('DD-MMM-YYYY')
            )
        },

        {
            field: 'role',
            headerName: 'User status',
            width: 150,
            headerClassName: 'header-bold', // Add this line
            cellClassName: 'cell-bold',
            renderCell: (params) => (
                params.row.role === 1 ? "Admin" : "Regular user"
            )
        },

        {
            field: 'createdAt',
            headerName: 'Joined date',
            width: 150,
            headerClassName: 'header-bold', // Add this line
            cellClassName: 'cell-bold',
            renderCell: (params) => (
                moment(params.row.createdAt).format('YYYY-MM-DD')
            )
        },

    ];

    return (
        <>
            <Box >
                <Paper sx={{ bgcolor: "secondary.midNightBlue" }} >

                    <Box sx={{ height: 399, width: '100%' }}>
                        <CustomDataGrid
                             getRowId={(row) => row._id}
                             rows={indexedData}
                             columns={columns}
                             pageSize={5}  
                             rowsPerPageOptions={[5, 10, 20]}  
                            //  autoPageSize
                             pagination
                            // checkboxSelection
                            slots={{ toolbar: GridToolbar }}
                        />
                    </Box>
                </Paper>

            </Box>
        </>
    )
}

export default AdmUsers
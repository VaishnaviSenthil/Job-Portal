import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Tooltip } from '@mui/material';

const ApplicationStatusDropdown = ({ userId, jobHistoryId, appStatus,onSave, onStatusChange   }) => {
  const [status, setStatus] = useState('');
  const [save, setSave] = useState(false);
  

  useEffect(() => {
    setStatus(appStatus); 
  }, [appStatus]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setSave(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/updateStatus/${userId}/jobHistory/${jobHistoryId}`, {
        applicationStatus: status,
      });
      console.log('Application status updated successfully.');
      toast.success('Status updated successfully');
      setSave(false);
      onStatusChange(userId, jobHistoryId, status);
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  return (
    <>
   
      <Select
        value={status}
        onChange={handleStatusChange}
        placeholder="Edit Status"
        displayEmpty
        // disabled={appStatus === 'Accepted'}
      >
        <MenuItem value="Pending" sx={{color:'darkOrange'}} disabled={appStatus === 'Pending'}>Pending</MenuItem>
        <MenuItem value="Accepted" sx={{color:'green'}} disabled={appStatus === 'Accepted'}>Accepted</MenuItem>
        <MenuItem value="Rejected" sx={{color:'red'}} disabled={appStatus === 'Rejected'}>Rejected</MenuItem>
      </Select>
      <Tooltip title="Update">
      <Button disabled={!save} sx={{ marginLeft: 2 }} variant="contained" onClick={handleSave}>
        Save
      </Button></Tooltip>
      
    </>
  );
};

export default ApplicationStatusDropdown;

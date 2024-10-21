import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import {TextField} from "@mui/material";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";

const SelectJob = ({ handleChangeCategory, cat }) => {
  const { jobType } = useSelector((state) => state.jobType);
  const { palette } = useTheme();

  return (
    <Box sx={{ minWidth: 120 }}>
      <TextField
        fullWidth
        select
        label="Category"
        id="demo-simple-select"
        placeholder="Category"
        value={cat}
        onChange={handleChangeCategory}
        SelectProps={{
          sx: {
            "& .MuiList-root": {
              backgroundColor: "palette.secondary.main",
            },
          },
        }}
        displayEmpty
      >
        <MenuItem value="">All</MenuItem>
        {jobType &&
          jobType.map((jt) => (
            <MenuItem key={jt._id} value={jt._id}>
              {jt.jobType}
            </MenuItem>
          ))}
      </TextField>
    </Box>
  );
};

export default SelectJob;

// inputProps={{
//     MenuProps: {
//         MenuListProps: {
//             sx: {
//                 backgroundColor: palette.secondary.main
//             }
//         }
//     }
// }}

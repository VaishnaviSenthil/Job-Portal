import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {useState} from 'react';

const PasswordField = ({ password, onPasswordChange }) => {
  const [showPassword, setShowPassword] = useState(false);
//   const [password, setPassword] = useState('');

const handlePassChange = (event) => {
    onPasswordChange(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TextField
  id="outlined-adornment-password"
  type={showPassword ? 'text' : 'password'}
  label="Password"
  value={password}
  onChange={handlePassChange}
  variant="outlined"
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleClickShowPassword}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
  );
};

export default PasswordField;

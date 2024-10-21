import {createTheme} from '@mui/material/styles';
import {lightBlue,blueGrey} from '@mui/material/colors';

export const theme =  createTheme({
    palette:{
        primary:{
            main:blueGrey[500],
            white: "#fff"
        },
        secondary:{
            main:lightBlue[800],
            black:"#000000",
            myChoice:"#03DAC6"
        }
    }
    
})
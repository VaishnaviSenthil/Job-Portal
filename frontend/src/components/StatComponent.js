import { Card,  CardHeader, IconButton, Typography, useTheme } from '@mui/material'
import React from 'react'

const StatComponent = ({ value, icon, description }) => {
    const { palette } = useTheme();
    return (
        <>
            <Card sx={{ bgcolor: palette.secondary.midNightBlue, width: "100%" }}>
      <CardHeader
        avatar={
          <IconButton sx={{ bgcolor: palette.primary.main }}>
            {icon}
          </IconButton>
        }
        title={
          <Typography variant='h5' sx={{ color: "#00008B", fontWeight: 600 }}>
             {description}
          </Typography>
        }
         
        subheader={
          <Typography variant="h6" sx={{ color: palette.primary.black ,paddingLeft:'10px'}}>
           
            {value}
          </Typography>
        }
      />
    </Card>
        </>
    )
}

export default StatComponent
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton, useTheme ,Tooltip} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {useState} from 'react';
import Modal from '../pages/user/JobModal';
import { userProfileAction,userJobApplyAction } from "../redux/actions/userAction";
import { useDispatch } from "react-redux";
import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { isMobile } from 'react-device-detect';


const CardElement = ({ jobTitle, company,skills, salary,description, category, location, id }) => {
    const { palette } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const { user } = useSelector((state) => state.userProfile);
    const dispatch = useDispatch();
    const cardWidth = isMobile ? '100%' : 650;


    useEffect(() => {
        dispatch(userProfileAction());
      }, []);
    
    const applyForAJob = () => {
        dispatch(
            userJobApplyAction({
                jobId: id,
                title: jobTitle,
                company: company,
                description: description,
                skills: skills,
                salary: salary,
                location: location,
            })
        );
    };

    const handleOpenModal = (jobId) => {
        setSelectedJobId(jobId)
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsModalOpen(false);
      };
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

    return (
        <div>
        <Card sx={{width: cardWidth, mb: 3, mt: 3, bgcolor: palette.primary.white }}>

            <CardContent >
                <Typography sx={{ fontSize: 15, color: palette.secondary.main, fontWeight: 500 }} gutterBottom>
                <IconButton>
                            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                                <LocationOnIcon sx={{ color: palette.secondary.main, fontSize: 18 }} />
                            </a>
                        </IconButton> <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}> {location} </a>
                </Typography>
                <Typography variant="h5" component="div">
                    {jobTitle}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.black">
                    {category}
                </Typography>
                <Typography variant="body2">
                    Description: {description.split(" ").slice(0, 15).join(" ") + "..."}
                </Typography>
            </CardContent>
            <CardActions>
                {/* <Button disableElevation variant='contained' size="small" startIcon={<AddIcon />}><Link style={{ textDecoration: "none", color: "white", boxShadow: 0 }} to={`/job/${id}`}>More Details</Link></Button> */}

                {user &&<Tooltip title="Click to apply" placement="left">
                        <Button
                            onClick={applyForAJob}
                            variant="contained"
                            color="success"
                        >
                            Apply
                        </Button>
                    </Tooltip>}
                {user &&<Tooltip title="Click to view details" placement="right"><Button
                    onClick={() => handleOpenModal(id)}
                    variant="contained"
                    color="secondary"
                  >
                    {isMobile?"More":"More Details"}
                  </Button></ Tooltip>}
            </CardActions>
        </Card>
        {isModalOpen && <Modal jobId={selectedJobId} onClose={handleCloseModal} />}
        </ div>
    );
}

export default CardElement;
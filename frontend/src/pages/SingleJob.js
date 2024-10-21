import { Card, CardContent, Stack, Typography,Modal } from '@mui/material'
import { Box, Container } from '@mui/system'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import LoadingBox from '../components/LoadingBox'
import Navbar from '../components/NavBar'
import { jobLoadSingleAction } from '../redux/actions/jobActions'
import { userJobApplyAction } from '../redux/actions/userAction';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';






const SingleJob = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { singleJob, loading } = useSelector(state => state.singleJob)
    const { id } = useParams();
    useEffect(() => {
        dispatch(jobLoadSingleAction(id));
    }, [id]);

    const applyForAJob = () => {
        dispatch(userJobApplyAction({
            jobId : singleJob && singleJob._id,
            title: singleJob && singleJob.title,
            company: singleJob && singleJob.company,
            description: singleJob && singleJob.description,
            skills: singleJob && singleJob.skills,
            salary: singleJob && singleJob.salary,
            location: singleJob && singleJob.location
        }))
    }
    

    const handleGoBack = () => {
      navigate(-1);
    };


    return (
        <>

            <Box sx={{ bgcolor: "#fafafa" }}>

                <Navbar />
                <Box sx={{ height: '85vh' }}>
                    <Container sx={{ pt: '30px' }}>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 1, sm: 2, md: 4 }}
                        >
                            <Box sx={{ flex: 4, p: 2 }}>

                                {
                                    loading ? <LoadingBox /> :

                                        <Card>
                                            <CardContent>
                                                <Typography variant="h5" component="h3">
                                                    {singleJob && singleJob.title}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <Box component="span" sx={{ fontWeight: 700 }}>Salary</Box>: ₹{singleJob && singleJob.salary}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <Box component="span" sx={{ fontWeight: 700 }}>Job - Mode</Box>: {singleJob && singleJob.jobType ? singleJob.jobCategory : "No category"}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <Box component="span" sx={{ fontWeight: 700 }}>Location</Box>: {singleJob && singleJob.location}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <Box component="span" sx={{ fontWeight: 700 }}>Description</Box>: {singleJob && singleJob.description}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <Box component="span" sx={{ fontWeight: 700 }}>Job Deadline</Box>:{singleJob && singleJob.deadline.split('T')[0]}
                                                </Typography>

                                            </CardContent>
                                        </Card>
                                }
                            </Box>
                            <Box sx={{ flex: 1, p: 2 }}>
                                <Card sx={{ p: 2 }}>
                                    <Button onClick={applyForAJob} sx={{ fontSize: "15px" , mb: 2 }} variant='contained'>Apply for this Job</Button>
                                    <Button onClick={handleGoBack} sx={{ fontSize: "15px" }} variant='contained'>Go Back To Jobs</Button>
                                </Card>
                                
                            </Box>

                        </Stack>
                       

                    </Container>
                </Box>
                <Footer />
            </Box>
        </>
    )
}

export default SingleJob
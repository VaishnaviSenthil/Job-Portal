import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, InputBase,Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { isMobile } from 'react-device-detect';

const validationSchema = yup.object({
    search: yup
        .string('Enter your search query')
        .required('This field cannot be empty'),
});

const SearchBar = () => {
    const navigate = useNavigate();

    const onSubmit = (values, actions) => {
        const { search } = values;
        if (search.trim()) {
            navigate(`/search/${search}`);
        } else {
            navigate('/');
        }
        actions.resetForm();
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            search: '',
        },
        validationSchema: validationSchema,
        onSubmit,
    });

    return (
        <form onSubmit={handleSubmit} style={{ width: isMobile ? '50%' : '100%' }}>
            <Box sx={{ width: isMobile ? '170%' : '100%', display: 'flex', justifyContent: 'center' }}>
                <InputBase
                    sx={{
                        bgcolor: 'lightgrey',
                        padding: '5px', // Reduce the padding
                        fontSize: '14px', // Reduce the font size
                        color: 'rgba(0, 0, 0, 0.9)',
                        width: isMobile ? '100%' : 'auto', // Adjust width on mobile
                    }}
                    fullWidth={true}
                    id="search"
                    name="search"
                    label="search"
                    placeholder="company or role..."
                    value={values.search}
                    onChange={handleChange}
                    error={touched.search && Boolean(errors.search)}
                />
                <Button color="primary" variant="contained" sx={{ width: '5px', height: '30px', marginTop: 0.5, marginLeft: 1 }} type="submit" disabled={isSubmitting}>
                <Tooltip title="Search by role"><SearchIcon /></ Tooltip>
                </Button>
            </Box>
            <Box component="span" sx={{ color: 'orange' }}>{touched.search && errors.search}</Box>
        </form>
    );
};

export default SearchBar;

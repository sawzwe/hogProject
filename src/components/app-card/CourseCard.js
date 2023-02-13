import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardContent, Grid, Typography, Box, Button, Divider } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
//
import { Icon } from '@iconify/react';

CourseCard.propTypes = {
    eachCourse: PropTypes.object,
};

export default function CourseCard({ eachCourse }) {

    const {
        studyCourseId,
        subject,
        type,
    } = eachCourse

    return (
        <Grid container sx={{ my: 2 }}>
            <Box display="inline-block" sx={{ width: '100%' }}>
                <Card variant="outlined" sx={{ display: 'flex',  justifyContent: 'space-between', borderRadius: 1, boxShadow: 0, cursor: "pointer" }} onClick={() => console.log("Clicked")}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent>
                            <Typography variant="h6" component="div" gutterBottom>
                                {subject}
                            </Typography>
                            <Typography color="text.secondary">
                                {type}
                            </Typography>
                        </CardContent>
                    </Box>
                    <CardActions>
                        <Icon icon="ic:round-chevron-right" color="#c2c2c2" width="50" height="50" />
                    </CardActions>
                </Card>
            </Box>
        </Grid>
    )
}
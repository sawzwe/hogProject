import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Card, CardActions, CardContent, Grid, Typography, Box, Link } from '@mui/material';
//
import { Icon } from '@iconify/react';

RequestCard.propTypes = {
    accountRole: PropTypes.string,
    eachCourse: PropTypes.object,
};

export default function RequestCard({ accountRole, eachCourse }) {
    const {
        id,
        course,
        subject,
        level,
        type,
        requestDate,
        cancelDate,
        makeupDate,
        status,
    } = eachCourse

    const privateCourseLink = (accountRole === 'student' ? `/dashboard/student-course/private-course/${id}` : `/dashboard/teacher-course/private-course/${id}`)
    const groupCourseLink = (accountRole === 'student' ? `/dashboard/student-course/group-course/${id}` : `/dashboard/teacher-course/group-course/${id}`)
    const completeLink = (accountRole === 'student' ? `/dashboard/student-inbox/${id}` : `/dashboard/teacher-inbox/${id}`)


    return (
        <Grid container sx={{ my: 2 }}>
            <Box display="inline-block" sx={{ width: '100%' }}>
                <Link to={completeLink} underline='none' component={RouterLink} sx={{ display: 'flex', flexDirection: 'column', color: 'text.primary' }}>
                {/* <Link to={type === 'Group' ? groupCourseLink : privateCourseLink} underline='none' component={RouterLink} sx={{ display: 'flex', flexDirection: 'column', color: 'text.primary' }}> */}
                    <Card
                        variant="outlined"
                        sx={{ display: 'flex', justifyContent: 'space-between', borderRadius: 1, boxShadow: 0, cursor: "pointer" }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent>
                                <Typography variant="h6" component="div" gutterBottom>
                                    Cancel and Makeup Class
                                </Typography>
                                <Typography color="text.secondary">
                                {course} {subject} {level} ({type})
                                </Typography>
                                <Typography color="text.secondary">
                                    Request Date: {requestDate}
                                </Typography>
                            </CardContent>
                        </Box>
                        <CardActions>
                            <Icon icon="ic:round-chevron-right" color="#c2c2c2" width="50" height="50" />
                        </CardActions>
                    </Card>
                </Link>
            </Box>
        </Grid>
    )
}
import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Card, CardActions, CardContent, Grid, Typography, Box, Link } from '@mui/material';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

CourseCard.propTypes = {
    accountRole: PropTypes.string,
    eachCourse: PropTypes.object,
};

export default function CourseCard({ accountRole, eachCourse }) {
    const {
        id,
        course,
        subject,
        level,
        section,
        type,
    } = eachCourse

    const privateCourseLink = (accountRole === 'student' ? `/dashboard/student-course/private-course/${id}` : `/dashboard/teacher-course/private-course/${id}`)
    const groupCourseLink = (accountRole === 'student' ? `/dashboard/student-course/group-course/${id}` : `/dashboard/teacher-course/group-course/${id}`)

    return (
        <Grid container sx={{ my: 2 }}>
            <Box display="inline-block" sx={{ width: '100%' }}>
                <Link to={type === 'Group' ? groupCourseLink : privateCourseLink} underline='none' component={RouterLink} sx={{ display: 'flex', flexDirection: 'column', color: 'text.primary' }}>
                    <Card
                        variant="outlined"
                        sx={{ display: 'flex', justifyContent: 'space-between', borderRadius: 1, boxShadow: 1, cursor: "pointer" }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent>
                                <Typography variant="body1" component="div">
                                    {course} {subject} {level}
                                </Typography>
                                <Typography color="text.secondary">
                                    {type}
                                </Typography>
                                {accountRole === 'teacher' && (
                                    <Typography color="text.secondary" >
                                        {section}
                                    </Typography>
                                )}
                            </CardContent>
                        </Box>
                        <CardActions>
                            <ArrowForwardIosRoundedIcon fontSize='large' sx={{color: "#D7D7D7"}} />
                        </CardActions>
                    </Card>
                </Link>
            </Box>
        </Grid>
    )
}
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

    return (
        <>
            {accountRole === 'student' ? 
            (
                <StudentRequestCard studentRole={accountRole} studentCourse={eachCourse} />
            ) 
            :
            (
                <TeacherRequestCard teacherRole={accountRole} teacherCourse={eachCourse} />
            )
            }
        </>
    )
}


// ----------------------------------------------------------------

StudentRequestCard.propTypes = {
    studentRole: PropTypes.string,
    studentCourse: PropTypes.object,
};

function StudentRequestCard({ studentRole, studentCourse }) {
    const {
        id,
        course,
        subject,
        level,
        type,
        requestDate,
        status,
    } = studentCourse

    const completeLink = (studentRole === 'student' ? `/student-inbox/${id}` : `/teacher-inbox/${id}`)

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
        </Grid>)
}

// ----------------------------------------------------------------

TeacherRequestCard.propTypes = {
    teacherRole: PropTypes.string,
    teacherCourse: PropTypes.object,
};

function TeacherRequestCard({ teacherRole, teacherCourse }) {
    const {
        id,
        requestDate,
        leaveType,
    } = teacherCourse

    const completeLink = (teacherRole === 'student' ? `/student-inbox/${id}` : `/teacher-inbox/${id}`)

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
                                    Request History
                                </Typography>
                                <Typography color="text.secondary">
                                    {leaveType}
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
        </Grid>)
}
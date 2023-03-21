import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Card, CardActions, CardContent, Grid, Typography, Box } from '@mui/material';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
// utils
import { fDate } from '../../utils/formatTime'

ClassCard.propTypes = {
    accountRole: PropTypes.string,
    eachClass: PropTypes.object,
    onOpen: PropTypes.func
};

export default function ClassCard({ accountRole, eachClass, onOpen }) {
    // console.log('card',eachClass)
    
    const teacher = eachClass.teacher.fullName
    const {
        id,
        classNo,
        date,
        fromTime,
        toTime,
        room,
      } = eachClass;
      
    //   console.log(teacher);
    // console.log(eachClass.teacher.fullName)
    if (accountRole === 'student') {
        return (
            <Grid container sx={{ my: 2 }}>
                <Box display="inline-block" sx={{ width: '100%' }}>
                    <Card
                        variant="outlined"
                        sx={{ display: 'flex', justifyContent: 'space-between', borderRadius: 1, boxShadow: 1 }}
                        // onClick={() => onOpen(eachClass)}
                        >
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ pr: 0 }}>
                                <Typography variant="body1" component="div">
                                    Class {classNo.toString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom={eachClass.attendance === 'Complete'}>
                                    {fDate(date, 'dd MMMM yyyy')} | {fromTime} - {toTime} {room ? `| R.${room}` : ''}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Teacher: {teacher}
                                </Typography>
                                {eachClass.attendance !== 'None' && (
                                    <Typography variant="body2" sx={{ color: (eachClass.attendance === 'Present' ? '#36B37E' : eachClass.attendance === 'Absent' ? '#FF5630' : '#FFAB00') }}>
                                        {eachClass.attendance.toUpperCase()}
                                    </Typography>
                                )}
                            </CardContent>
                        </Box>
                        {/* <CardActions sx={{ pl: 0 }}>
                            <ArrowForwardIosRoundedIcon fontSize='large' sx={{ color: "#D7D7D7" }} />
                        </CardActions> */}
                    </Card>
                </Box>
            </Grid>
        )
    }

    const groupClassLink = (accountRole === 'teacher' && `/teacher-course/group-course/${eachClass.course.id}/check-attendance/${eachClass.id}`)
    const privateClassLink = (accountRole === 'teacher' && `/teacher-course/private-course/${eachClass.course.id}/check-attendance/${eachClass.id}`)

    return (
        <Grid container sx={{ my: 2 }}>
            <Box display="inline-block" sx={{ width: '100%' }}>
                <Card
                    variant='outlined'
                    to={eachClass.course.type === 'Group' ? groupClassLink : privateClassLink}
                    component={RouterLink}
                    sx={{ display: 'flex', justifyContent: 'space-between', borderRadius: 1, boxShadow: 1, cursor: "pointer", textDecoration: 'none' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ pr: 0 }}>
                            <Typography variant="body1" component="div">
                                Class {classNo.toString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom={eachClass.attendanceStatus !== 'None'}>
                                {fDate(date, 'dd MMMM yyyy')} | {fromTime} - {toTime} {room ? `| R.${room}` : ''}
                            </Typography>
                            {eachClass.attendanceStatus !== 'Incomplete' && (
                                <Typography variant="body2" sx={{ color: (eachClass.attendanceStatus === 'Complete' ? '#36B37E' : eachClass.attendanceStatus === 'Incomplete' && '#FF5630') }}>
                                    {eachClass.attendanceStatus.toUpperCase()}
                                </Typography>
                            )}
                        </CardContent>
                    </Box>
                    <CardActions sx={{ pl: 0 }}>
                        <ArrowForwardIosRoundedIcon fontSize='large' sx={{ color: "#D7D7D7" }} />
                    </CardActions>
                </Card>
            </Box>
        </Grid>
    )
}
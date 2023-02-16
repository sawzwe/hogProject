import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// @mui
import { Card, CardActions, CardContent, Grid, Typography, Box, Button, Divider } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

CalendarClassCard.propTypes = {
    accountRole: PropTypes.string,
    eachClass: PropTypes.object,
};

export default function CalendarClassCard({ accountRole, eachClass }) {

    const {
        id,
        course,
        fromTime,
        toTime,
        room,
        teacher,
        section
    } = eachClass

    return (
        <Grid container sx={{ my: 2 }}>
            <Box display="inline-block" sx={{ width: '100%' }}>
                <Card variant="outlined" sx={{ borderRadius: 1, boxShadow: 0 }}>
                    <CardContent sx={{ pb: 2 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                            {fromTime} - {toTime}
                        </Typography>
                        <Typography color="text.secondary">
                            {`${course.course} ${course.subject} ${course.level} (${course.type.toUpperCase()})`}
                        </Typography>
                        <Typography color="text.secondary">
                            {!!room && `R.${room} | `} {accountRole === 'student' ? teacher.fullName : section}
                        </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button
                            fullWidth
                            size="medium"
                            endIcon={<NavigateNextIcon />}
                            sx={{ justifyContent: "flex-start", pl: 2 }}
                            component={Link}
                            to={course.type === 'Group' ? `/dashboard/student-course/group-course/${course.id}` : `/dashboard/student-course/private-course/${course.id}`}>
                            Course detail
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Grid>
    )
}
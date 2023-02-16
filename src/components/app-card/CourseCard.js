import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Card, CardActions, CardContent, Grid, Typography, Box, Button, Divider, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
//
import { Icon } from '@iconify/react';

CourseCard.propTypes = {
    course: PropTypes.object,
};

export default function CourseCard({ course }) {
    const {
        id,
        subject,
        type,
    } = course

    return (
        <Grid container sx={{ my: 2 }}>
            <Box display="inline-block" sx={{ width: '100%' }}>
                <Link to={type === 'Group' ? `/dashboard/student-course/group-course/${id}` : `/dashboard/student-course/private-course/${id}`} underline='none' component={RouterLink} sx={{ display: 'flex', flexDirection: 'column', color: 'text.primary' }}>
                    <Card
                        variant="outlined"
                        sx={{ display: 'flex', justifyContent: 'space-between', borderRadius: 1, boxShadow: 0, cursor: "pointer" }}>
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
                </Link>
            </Box>
        </Grid>
    )
}
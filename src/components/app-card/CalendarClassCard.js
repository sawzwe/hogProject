import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// @mui
import { Card, CardActions, CardContent, Grid, Typography, Box, Button, Divider } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

CalendarClassCard.propTypes = {
    type: PropTypes.string,
    eachClass: PropTypes.object,
};

export default function CalendarClassCard({ type, eachClass }) {

    const {
        id,
        courseId,
        subject,
        from,
        to,
        room,
        teacher
    } = eachClass

    return (
        <Grid container sx={{ my: 2 }}>
            <Box display="inline-block" sx={{ width: '100%' }}>
                <Card variant="outlined" sx={{ borderRadius: 1, boxShadow: 0 }}>
                    <CardContent sx={{ pb: 2 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                            {from} - {to}
                        </Typography>
                        <Typography color="text.secondary">
                            {subject}
                        </Typography>
                        <Typography color="text.secondary">
                            {!!room && `R.${room} | `} {teacher}
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
                            to={type === 'Group' ? `/dashboard/student-course/group-course/${courseId}` : `/dashboard/student-course/private-course/${courseId}`}>
                            Course detail
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Grid>
    )
}
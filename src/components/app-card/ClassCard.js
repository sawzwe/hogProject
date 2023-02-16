import React from 'react';
import PropTypes from 'prop-types';
// @mui
import { Card, CardActions, CardContent, Grid, Typography, Box, Button, Divider } from '@mui/material';
//
import { Icon } from '@iconify/react';
// utils
import { fDate } from '../../utils/formatTime'

ClassCard.propTypes = {
    eachClass: PropTypes.object,
    onOpen: PropTypes.func
};

export default function ClassCard({ eachClass, onOpen }) {

    const {
        classNo,
        date,
        fromTime,
        toTime,
        room,
        attendance
    } = eachClass;

    return (
        <Grid container sx={{ my: 2 }}>
            <Box display="inline-block" sx={{ width: '100%' }}>
                <Card
                    variant="outlined"
                    sx={{ display: 'flex', justifyContent: 'space-between', borderRadius: 1, boxShadow: 0, cursor: "pointer" }}
                    onClick={() => onOpen(eachClass)}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ pr: 0 }}>
                            <Typography variant="h6" component="div" gutterBottom>
                                Class {classNo.toString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {fDate(date, 'dd MMMM yyyy')} | {fromTime} - {toTime} {!!room ? `| R.${room}` : ''}
                            </Typography>
                            {attendance !== 'None' && (
                                <Typography variant="body2" sx={{ color: (attendance === 'Present' ? '#36B37E' : attendance === 'Absent' ? '#FF5630' : '#FFAB00') }}>
                                    {attendance.toUpperCase()}
                                </Typography>
                            )}
                        </CardContent>
                    </Box>
                    <CardActions sx={{ pl: 0 }}>
                        <Icon icon="ic:round-chevron-right" color="#c2c2c2" width="50" height="50" />
                    </CardActions>
                </Card>
            </Box>
        </Grid>
    )
}
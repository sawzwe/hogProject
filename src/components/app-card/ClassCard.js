import React from 'react';
import PropTypes from 'prop-types';
// @mui
import { Card, CardActions, CardContent, Grid, Typography, Box, Button, Divider } from '@mui/material';
//
import { Icon } from '@iconify/react';
// utils
import { fDate } from '../../utils/formatTime'

ClassCard.propTypes = {
    classNo: PropTypes.number,
    eachClass: PropTypes.object,
};

export default function ClassCard({ classNo, eachClass }) {

    const {
        date,
        from,
        to,
        room,
        teacher
    } = eachClass;

    return (
        <Grid container sx={{ my: 2 }}>
            <Box display="inline-block" sx={{ width: '100%' }}>
                <Card
                    variant="outlined"
                    sx={{ display: 'flex', justifyContent: 'space-between', borderRadius: 1, boxShadow: 0, cursor: "pointer" }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ pr: 0 }}>
                            <Typography variant="h6" component="div" gutterBottom>
                                Class {classNo.toString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {fDate(date, 'dd MMMM yyyy')} | {from} - {to} {!!room ? `| R.${room}` : ''}
                            </Typography>
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
import PropTypes from 'prop-types';
import { Fragment, useState, React } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Divider, Dialog, DialogContent, Typography, Stack, Card, Box, CardContent, CardActions } from '@mui/material';
//
import { Icon } from '@iconify/react';

TeacherRequestInboxEach.propTypes = {
    currentRequest: PropTypes.object,
};

export default function TeacherRequestInboxEach({ currentRequest }) {

    const { leaveType, fromDate, fromTime, toDate, toTime,durationDay,durationHour, status, requestDate, remark } = currentRequest;

    return (
        <>
            <Stack spacing={1}>
                <Box style={{ display: 'flex' }}>
                    <Typography variant='h6' style={{ marginRight: '4px' }}>Status: </Typography>
                    {
                        status === 'Complete' && (<Typography variant='h6' color="primary">{status}</Typography>)
                    }
                    {
                        status === 'Reject' && (<Typography variant='h6' color="error">{status}</Typography>)
                    }
                    {
                        status === 'Pending' && (<Typography variant='h6' color="#FFAB00">{status}</Typography>)
                    }
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Request Date: {requestDate}
                </Typography>
                <Divider />
                <Typography variant='h6'>Type of Leaving</Typography>
                <Typography variant='subtitle2'>{leaveType}</Typography>

                <Typography variant='h6'>From</Typography>

                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Date
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {fromDate}
                        </Typography>
                    </Box>

                    <Box sx={{ marginLeft: "40%" }}>
                        <Typography variant="body2" color="text.secondary">
                            Time
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {fromTime}
                        </Typography>
                    </Box>
                </Box>

                <Typography variant='h6'>To</Typography>
            
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Date
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {toDate}
                        </Typography>
                    </Box>

                    <Box sx={{ marginLeft: "40%" }}>
                        <Typography variant="body2" color="text.secondary">
                            Time
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {toTime}
                        </Typography>
                    </Box>
                </Box>

                <Typography variant='h6'>Duration</Typography>

                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Date
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                             {durationDay} 
                        </Typography>
                    </Box>

                    <Box sx={{ marginLeft: "40%" }}>
                        <Typography variant="body2" color="text.secondary">
                            Hour
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {durationHour} 
                        </Typography>
                    </Box>
                </Box>

                <Box>
                    <Typography variant='h6'>Remark</Typography>
                    <Typography variant='body2'>{remark}</Typography>
                </Box>
            </Stack>
        </>
    )
}




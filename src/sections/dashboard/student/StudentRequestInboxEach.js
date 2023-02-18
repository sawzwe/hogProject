import PropTypes from 'prop-types';
import { Fragment, useState, React } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Divider, Dialog, DialogContent, Typography, Stack, Card, Box, CardContent, CardActions } from '@mui/material';
//
import { Icon } from '@iconify/react';

StudentRequestInboxEach.propTypes = {
    currentRequest: PropTypes.object,
};

export default function StudentRequestInboxEach({ currentRequest }) {

    const { status, requestDate, cancelDate, course, type, tutor, remark } = currentRequest;

    return (
        <>
            <Stack spacing={1}>
                <Box style={{ display: 'flex' }}>
                    <Typography variant='h6' style={{ marginRight: '4px' }}>Status: </Typography>
                    {
                        status === 'Complete' && (<Typography  variant='h6' color="primary">{status}</Typography>)
                    } 
                                        {
                        status === 'Reject' && (<Typography  variant='h6' color="error">{status}</Typography>)
                    } 
                                        {
                        status === 'Pending' && (<Typography  variant='h6' color="#FFAB00">{status}</Typography>)
                    } 
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Request Date: {requestDate}
                </Typography>
                <Divider />
                <Typography variant='h6'>Cancel Date/Time</Typography>
                <Card
                    variant="outlined"
                    sx={{ display: 'flex', justifyContent: 'space-between', borderRadius: 1, boxShadow: 0, cursor: "pointer" }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent>
                            <Typography variant="body1" color="text.primary">
                                {cancelDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {course} ({type})
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {tutor}
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>
                <Box>
                    <Typography variant='h6'>Remark</Typography>
                    <Typography variant='body2'>{remark}</Typography>
                </Box>
            </Stack>
        </>
    )
}

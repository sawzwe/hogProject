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
                    <Typography variant='body2'>{currentRequest.remark}</Typography>
                </Box>
            </Stack>
        </>
    )
}

// --------------------------------------------------------------------------------------------------------

// ClassDialog.propTypes = {
//     open: PropTypes.bool,
//     onClose: PropTypes.func,
//     selectedClass: PropTypes.object,
// };

// export function ClassDialog({ open, onClose, selectedClass }) {
//     const navigate = useNavigate();

//     const handleClickMakeup = () => {
//         navigate(`/dashboard/student-course/private-course/${selectedClass.course.id}/makeup-class/${selectedClass.id}`)
//     }

//     return (
//         <Dialog
//             fullWidth
//             maxWidth="xs"
//             open={open}
//             onClose={onClose}>
//             <DialogContent sx={{ p: 3, textAlign: 'center' }}>
//                 <Card variant="outlined" sx={{ py: 2, borderRadius: '5px 5px 0px 0px' }}>
//                     <Typography variant="h6" sx={{ mx: 'auto' }}>{`${selectedClass.course.course} ${selectedClass.course.subject} ${selectedClass.course.level} (${selectedClass.course.type.toUpperCase()})`} </Typography>
//                 </Card>
//                 <Card sx={{ py: 2, borderRadius: 0, backgroundColor: '#007B55', color: 'white' }}>
//                     <Typography variant="inherit">
//                         {selectedClass.teacher.fullName}
//                     </Typography>
//                 </Card>
//                 <Card variant="outlined" sx={{ py: 2, borderRadius: '0px 0px 5px 5px' }}>
//                     <Stack direction="row" justifyContent="center" spacing={1}>
//                         <Typography>
//                             {`Time ${selectedClass.fromTime} - ${selectedClass.toTime} `}
//                         </Typography>
//                         {!!selectedClass.room && (
//                             <Typography>
//                                 {`Room ${selectedClass.room}`}
//                             </Typography>
//                         )}
//                     </Stack>
//                 </Card>
//                 {selectedClass.attendance === 'None' && selectedClass.course.type !== 'Group' && (
//                     <>
//                         <Card sx={{ mt: 3, py: 2, borderRadius: '5px 5px 0px 0px', backgroundColor: '#007B55', color: 'white' }}>
//                             <Typography >
//                                 Actions
//                             </Typography>
//                         </Card>
//                         <Card variant="outlined" sx={{ py: 1, borderRadius: '0px 0px 5px 5px', cursor: 'pointer' }} onClick={handleClickMakeup} >
//                             <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
//                                 <Typography >
//                                     Cancel and makeup class
//                                 </Typography>
//                                 <Icon icon="ic:round-chevron-right" color="#c2c2c2" width="40" height="40" />
//                             </Stack>
//                         </Card>
//                     </>
//                 )}
//             </DialogContent>
//         </Dialog>
//     )
// }


import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Card, Typography, Grid, Radio, RadioGroup, FormControlLabel, FormControl, Stack, MenuItem, InputLabel, Select, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
// components
import MakeupCard from '../../../components/app-card/MakeupCard';
// utils
import { fDate } from '../../../utils/formatTime';

StudentMakeup.propTypes = {
    currentClass: PropTypes.object
};

export default function StudentMakeup({ currentClass }) {

    const AVAILABLE_TIME = [
        '09:00', '10:00', '11:00', '12:00'
    ];

    const AVAILABLE_TIME_SLOTS = [
        { date: '23 March 2023', fromTime: '10:00', toTime: '12:00' },
        { date: '30 March 2023', fromTime: '10:00', toTime: '12:00' },
        { date: '1 April 2023', fromTime: '10:00', toTime: '12:00' },
        { date: '2 April 2023', fromTime: '10:00', toTime: '12:00' },
        { date: '3 April 2023', fromTime: '10:00', toTime: '12:00' },
        { date: '4 April 2023', fromTime: '10:00', toTime: '12:00' }
    ];

    const {
        course,
        date,
        fromTime,
        toTime,
        teacher
    } = currentClass;

    const [cancelType, setCancelType] = useState('');

    // Custom Hours
    const [customFromTime, setCustomFromTime] = useState('');
    const [customToTime, setCustomToTime] = useState('');

    const handleChange = (event) => {
        setCustomFromTime('');
        setCustomToTime('');
        setCancelType(event.target.value);
    };

    const handleChangeFromTime = (event) => {
        setCustomFromTime(event.target.value);
        setCustomToTime('');
    }

    const handleChangeToTime = (event) => {
        setCustomToTime(event.target.value);
    }

    // Dialog for selected time slot
    const [selectedTimeSlot, setSelectedTimeSlot] = useState({});
    const [openTimeSlotDialog, setOpenTimeSlotDialog] = useState(false);

    const handleSelectTimeSlot = (timeSlot) => {
        setSelectedTimeSlot(timeSlot);
        setOpenTimeSlotDialog(true);
    }

    const handleCloseTimeSlotDialog = () => {
        setOpenTimeSlotDialog(false);
        setTimeout(() => {
            setSelectedTimeSlot({});
        }, 200)
    }

    return (
        <>
            <Grid container sx={{ my: 2 }}>
                <Grid item xs md>
                    <Card variant='outlined' sx={{ py: 2, px: 2, borderRadius: 1 }}>
                        <Typography>
                            {`${fDate(date, 'dd MMMM yyyy')} | ${fromTime} - ${toTime}`}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                            {`${course.subject} (${course.type})`}
                        </Typography>
                        <Typography variant="caption" component='div' color='text.secondary'>
                            {teacher.fullName}
                        </Typography>
                    </Card>
                </Grid>
            </Grid>

            <FormControl sx={{ mx: 1, mb: 1 }}>
                <Typography variant="h6" sx={{ color: "black" }}>Cancel</Typography>
                <RadioGroup
                    value={cancelType}
                    onChange={handleChange}
                >
                    <Stack direction="row" spacing={1}>
                        <FormControlLabel value="Full Class" control={<Radio />} label="Full Class" />
                        <FormControlLabel value="Custom Hour" control={<Radio />} label="Custom Hour" />
                    </Stack>
                </RadioGroup>
            </FormControl>

            {cancelType === 'Custom Hour' && (
                <Stack direction="row" spacing={5} sx={{ mb: 3, mt: 1, mx: 1 }}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel>From</InputLabel>
                        <Select
                            value={customFromTime}
                            label="From"
                            onChange={handleChangeFromTime}
                            onClose={() => {
                                setTimeout(() => {
                                    document.activeElement.blur()
                                }, 0)
                            }}
                        >
                            {AVAILABLE_TIME.map((time, index) => time >= currentClass.fromTime && (
                                <MenuItem
                                    key={index}
                                    value={time}
                                    sx={{
                                        mx: 1,
                                        my: 0.5,
                                        borderRadius: 0.75,
                                        typography: 'body2',
                                        '&:first-of-type': { mt: 0 },
                                        '&:last-of-type': { mb: 0 },
                                    }}>
                                    {time}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel>To</InputLabel>
                        <Select
                            value={customToTime}
                            label="To"
                            onChange={handleChangeToTime}
                            disabled={!customFromTime}
                            onClose={() => {
                                setTimeout(() => {
                                    document.activeElement.blur()
                                }, 0)
                            }}
                        >
                            {AVAILABLE_TIME.map((time, index) => time > customFromTime && (
                                <MenuItem key={index} value={time} sx={{
                                    mx: 1,
                                    my: 0.5,
                                    borderRadius: 0.75,
                                    typography: 'body2',
                                    textTransform: 'capitalize',
                                    '&:first-of-type': { mt: 0 },
                                    '&:last-of-type': { mb: 0 },
                                }}>
                                    {time}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            )}

            {cancelType === 'Custom Hour' && !!customFromTime && !!customToTime && (
                <TimeSlots options={AVAILABLE_TIME_SLOTS} onSelect={handleSelectTimeSlot} currentClass={currentClass} />
            )}

            {cancelType === 'Full Class' && (
                <TimeSlots options={AVAILABLE_TIME_SLOTS} onSelect={handleSelectTimeSlot} currentClass={currentClass} />
            )}

            <TimeSlotDialog
                open={openTimeSlotDialog}
                onClose={handleCloseTimeSlotDialog}
                course={course}
                currentClass={currentClass}
                selectedTimeSlot={selectedTimeSlot}
            />
        </>
    )
}

// --------------------------------------------------------------------------------------------------------------

TimeSlotDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    course: PropTypes.object,
    currentClass: PropTypes.object,
    selectedTimeSlot: PropTypes.object
};

export function TimeSlotDialog({ open, onClose, course, currentClass, selectedTimeSlot }) {
    const navigate = useNavigate();

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const confirmTimeSlot = async () => {
        try {
            setOpenConfirmDialog(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseConfirmDialog = () => {
        navigate('/dashboard/student-calendar')
        console.log("Navigate to another page!");
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
                <DialogTitle sx={{ mx: 'auto', pb: 0 }}>
                    <MarkEmailReadIcon sx={{ fontSize: '100px' }} />
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" align="center" sx={{ fontWeight: 'bold', fontSize: 'h5.fontSize', mb: 1 }}>
                        Cancel and Makeup Class
                    </Typography>
                    <Typography align="center">
                        {course.type.toUpperCase()} {course.subject}
                    </Typography>
                    <Typography align="center">
                        {`FROM ${fDate(currentClass.date, 'dd MMM yyyy').toUpperCase()} (${currentClass.fromTime} - ${currentClass.toTime})`}
                    </Typography>
                    <Typography align="center">
                        {`TO ${fDate(selectedTimeSlot.date, 'dd MMM yyyy').toUpperCase()} (${selectedTimeSlot.fromTime} - ${selectedTimeSlot.toTime})`}
                    </Typography>
                </DialogContent>
                <Stack direction="row" spacing={1.5} sx={{ m: 3 }}>
                    <Button fullWidth variant="outlined" color="inherit" onClick={onClose}>Cancel</Button>
                    <LoadingButton fullWidth variant="contained" color="primary" onClick={confirmTimeSlot}>Confirm</LoadingButton>
                </Stack>
            </Dialog>
            <ConfirmDialog open={openConfirmDialog} onClose={handleCloseConfirmDialog} />
        </>
    )
}

// --------------------------------------------------------------------------------------------------------------

ConfirmDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};

export function ConfirmDialog({ open, onClose }) {
    return (
        <Dialog open={open} fullWidth maxWidth="xs">
            <DialogTitle sx={{ mx: 'auto', pb: 0 }}>
                <MarkEmailReadIcon sx={{ fontSize: '100px' }} />
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" align="center" sx={{ fontWeight: 'bold', fontSize: 'h5.fontSize', mb: 1 }}>
                    Your schedule is updated
                </Typography>
                <Typography align="center">
                    Please check your schedule in Calendar
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button fullWidth variant="contained" color="primary" onClick={onClose}>Tap to close</Button>
            </DialogActions>
        </Dialog>
    )
}

// --------------------------------------------------------------------------------------------------------------

TimeSlots.propTypes = {
    options: PropTypes.array,
    onSelect: PropTypes.func,
    currentClass: PropTypes.object
};

export function TimeSlots({ options, onSelect, currentClass }) {

    return (
        <>
            <Typography variant="h6" sx={{ mx: 1 }}>
                Available Time Slots
            </Typography>
            <Grid container sx={{ mt: 0.5 }} spacing={1}>
                {options.length > 0 &&
                    options.map((slot, index) => (
                        <Grid key={index} item xs={6} md={4}>
                            <MakeupCard slot={slot} select={onSelect} />
                        </Grid>
                    ))
                }
            </Grid>

            <Typography variant="h6" sx={{ mx: 1, mt: 3 }}>
                Makeup class is not available?
            </Typography>
            <Typography variant="body2" sx={{ mx: 1 }}>
                Press button below to sent the makeup request to House of Griffin.
            </Typography>
            <Stack direction="row" justifyContent="flex-start" sx={{ mx: 1, mt: 1 }}>
                <Button
                    to={`/dashboard/student-course/private-course/${currentClass.course.id}/makeup-class/${currentClass.id}/request`}
                    component={RouterLink}
                    fullWidth
                    size="large"
                    variant="outlined"
                    color="inherit"
                    sx={{ borderRadius: 0.7 }}
                >
                    Send Makeup Request
                </Button>
            </Stack>
        </>
    )
}
import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
    Typography,
    Container,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    RHFRadioGroup,
    Stack,
    FormControlLabel,
    RadioGroup,
    Radio,
    Box,
    InputAdornment,
    TextField,
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle
}
    from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LoadingButton } from '@mui/lab';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import EventIcon from '@mui/icons-material/Event';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// utils
import { fDate } from '../../../utils/formatTime';

export default function TeacherNewLeavingRequest() {

    const LEAVING_TYPE_OPTIONS = [
        'Sick Leave', 'Casual Leave'
    ];

    const LEAVING_FORMAT_OPTIONS = [
        'Full day', 'Custom hour'
    ];

    const [leavingType, setLeavingType] = useState('');
    const [leavingFormat, setLeavingFormat] = useState('');

    const handleChangeLeavingType = (e) => {
        setLeavingType(e.target.value);
        setLeavingFormat('');
    };

    const handleChangeLeavingFormat = (e) => {
        setLeavingFormat(e.target.value);
    }

    return (
        <>
            <Box sx={{ my: 2 }}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel>Type of leaving</InputLabel>
                    <Select
                        value={leavingType}
                        label="Type of leaving"
                        onChange={(e) => handleChangeLeavingType(e)}
                        onClose={() => {
                            setTimeout(() => {
                                document.activeElement.blur()
                            }, 0)
                        }}
                    >
                        {LEAVING_TYPE_OPTIONS.map((option, index) => (
                            <MenuItem
                                key={index}
                                value={option}
                                sx={{
                                    mx: 1,
                                    my: 0.5,
                                    borderRadius: 0.75,
                                    typography: 'body2',
                                    '&:first-of-type': { mt: 0 },
                                    '&:last-of-type': { mb: 0 },
                                }}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {leavingType &&
                <Box sx={{ mt: 2 }}>
                    <FormControl sx={{ mx: 1, mb: 1 }}>
                        <RadioGroup
                            value={leavingFormat}
                            onChange={(e) => handleChangeLeavingFormat(e)}
                        >
                            <Stack direction="row" spacing={1}>
                                <FormControlLabel value="Full Day" control={<Radio />} label="Full Day" />
                                <FormControlLabel value="Custom Hour" control={<Radio />} label="Custom Hour" />
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                </Box>
            }

            {leavingFormat === 'Full Day' && <FullDayLeavingRequest />}
            {leavingFormat === 'Custom Hour' && <CustomHourLeavingRequest />}

        </>
    )
}

export function FullDayLeavingRequest() {

    const isDesktop = useResponsive('up', 'lg');

    const today = new Date(2023, 2, 17);

    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(fromDate);
    const [remarks, setRemarks] = useState('');

    const onKeyDown = (e) => {
        e.preventDefault();
    };

    // Duration
    const getTotalHours = () => (((toDate.getTime() - fromDate.getTime()) % (1000 * 3600 * 24)));
    const getTotalDays = () => (((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)));

    // ConfirmDialog
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleSubmit = () => {
        console.log(fromDate)
        console.log(toDate)
        console.log(remarks)
    };

    return (
        <>
            <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>From Date</Typography>
                {isDesktop ? (
                    <DesktopDatePicker
                        value={fromDate}
                        onChange={(newValue) => {
                            setFromDate(newValue);
                            if (newValue.getTime() > toDate.getTime()) {
                                setToDate(newValue);
                            }
                        }}
                        minDate={today}
                        renderInput={(params) => <TextField onKeyDown={onKeyDown} {...params} />}
                        disableMaskedInput
                        inputFormat="dd MMMM yyyy"
                    />
                ) : (
                    <MobileDatePicker
                        value={fromDate}
                        onChange={(newValue) => {
                            setFromDate(newValue);
                            if (newValue.getTime() > toDate.getTime()) {
                                setToDate(newValue);
                            }
                        }}
                        minDate={today}
                        renderInput={(params) => <TextField onKeyDown={onKeyDown} fullWidth {...params} />}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <EventIcon />
                                </InputAdornment>
                            ),
                        }}
                        disableMaskedInput
                        inputFormat="dd MMMM yyyy"
                    />
                )}
            </Box>

            {fromDate && (
                <Box sx={{ my: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>To Date</Typography>
                    {isDesktop ? (
                        <DesktopDatePicker
                            value={toDate}
                            onChange={(newValue) => {
                                setToDate(newValue);
                            }}
                            minDate={fromDate}
                            renderInput={(params) => <TextField onKeyDown={onKeyDown} {...params} />}
                            disableMaskedInput
                            inputFormat="dd MMMM yyyy"
                        />
                    ) : (
                        <MobileDatePicker
                            value={toDate}
                            onChange={(newValue) => {
                                setToDate(newValue);
                            }}
                            minDate={fromDate}
                            renderInput={(params) => <TextField onKeyDown={onKeyDown} fullWidth {...params} />}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <EventIcon />
                                    </InputAdornment>
                                ),
                            }}
                            disableMaskedInput
                            inputFormat="dd MMMM yyyy"
                        />
                    )}
                </Box>
            )}

            {fromDate && toDate && toDate.getTime() >= fromDate.getTime() && (
                <>
                    <Typography sx={{ mt: 1, mb: 2 }}>Total leaving duration</Typography>
                    <Stack direction="row" justifyContent="flex-start" spacing={3} sx={{ mb: 2 }}>
                        <Stack direction="column">
                            <Typography>{`${getTotalDays()} ${`Day(s)`}`}</Typography>
                        </Stack>
                        <Stack direction="column">
                            <Typography>{`${getTotalHours()} ${`Hour(s)`}`}</Typography>
                        </Stack>
                    </Stack>

                    <Typography>{`Remarks (Optional)`}</Typography>
                    <TextField
                        fullWidth
                        value={remarks}
                        onChange={(event) => setRemarks(event.target.value)}
                        multiline
                        rows={3}
                        sx={{
                            mt: 1
                        }}
                    />

                    <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
                        <Button fullWidth size="large" variant="contained" color="primary" onClick={() => setOpenConfirmDialog(true)}>Submit</Button>
                    </Stack>

                    <ConfirmDialog
                        open={openConfirmDialog}
                        onClose={() => setOpenConfirmDialog(false)}
                        data={{ type: 'Full Day', fromDate, toDate, remarks }}
                    />
                </>
            )}
        </>
    )
}

export function CustomHourLeavingRequest() {

    const isDesktop = useResponsive('up', 'lg');

    const today = new Date(2023, 2, 17);

    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(fromDate);
    const [remarks, setRemarks] = useState('');
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');

    const onKeyDown = (e) => {
        e.preventDefault();
    };

    const PREFER_TIME_OPTIONS = [
        '09:00',
        // '09:30',
        '10:00',
        // '10:30',
        '11:00',
        // '11:30',
        '12:00',
        // '12:30',
        '13:00',
        // '13:30',
        '14:00',
        // '14:30',
        '15:00',
        // '15:30',
        '16:00',
        // '16:30',
        '17:00',
        // '17:30',
        '18:00',
        // '18:30',
        '19:00',
        // '19:30',
        '20:00',
    ];

    // Duration
    const getTotalHours = () => {
        const fDateTime = new Date(fDate(fromDate, 'MMMM dd, yyyy').concat(' ', fromTime.slice(0, 2), '', fromTime.slice(2, 5), '', ':00'))
        const tDateTime = new Date(fDate(toDate, 'MMMM dd, yyyy').concat(' ', toTime.slice(0, 2), '', toTime.slice(2, 5), '', ':00'))
        const totalHours = (Math.abs(fDateTime - tDateTime) / 36e5)
        return (totalHours % 24)
    };
    const getTotalDays = () => (((toDate - fromDate) / (1000 * 3600 * 24)));

    // Confirm Dialog
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    return (
        <>
            <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>From</Typography>
                <Stack direction="row" spacing={2}>
                    {isDesktop ? (
                        <DesktopDatePicker
                            value={fromDate}
                            label="Date"
                            onChange={(newValue) => {
                                setFromDate(newValue);
                                if (newValue.getTime() > toDate.getTime()) {
                                    setToDate(newValue);
                                }
                                setToTime('');
                            }}
                            minDate={today}
                            renderInput={(params) => <TextField fullWidth onKeyDown={onKeyDown} {...params} />}
                            disableMaskedInput
                            inputFormat="dd MMMM yyyy"
                        />
                    ) : (
                        <MobileDatePicker
                            value={fromDate}
                            label="Date"
                            onChange={(newValue) => {
                                setFromDate(newValue);
                                if (newValue.getTime() > toDate.getTime()) {
                                    setToDate(newValue);
                                }
                                setToTime('');
                            }}
                            minDate={today}
                            renderInput={(params) => <TextField fullWidth onKeyDown={onKeyDown} fullWidth {...params} />}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <EventIcon />
                                    </InputAdornment>
                                ),
                            }}
                            disableMaskedInput
                            inputFormat="dd MMMM yyyy"
                        />
                    )}

                    <FormControl fullWidth>
                        <InputLabel>Time</InputLabel>
                        <Select
                            value={fromTime}
                            label="Time"
                            onChange={(e) => setFromTime(e.target.value)}
                            fullWidth
                            onClose={() => {
                                setTimeout(() => {
                                    document.activeElement.blur()
                                }, 0)
                            }}
                        >
                            {PREFER_TIME_OPTIONS.map((time, index) => (
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
                </Stack>
            </Box>

            {fromDate && (
                <Box sx={{ my: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>To</Typography>
                    <Stack direction="row" spacing={2}>
                        {isDesktop ? (
                            <DesktopDatePicker
                                value={toDate}
                                label="Date"
                                onChange={(newValue) => {
                                    setToDate(newValue);
                                    setToTime('');
                                }}
                                minDate={fromDate}
                                renderInput={(params) => <TextField fullWidth onKeyDown={onKeyDown} {...params} />}
                                disableMaskedInput
                                inputFormat="dd MMMM yyyy"
                            />
                        ) : (
                            <MobileDatePicker
                                value={toDate}
                                label="Date"
                                onChange={(newValue) => {
                                    setToDate(newValue);
                                    setToTime('');
                                }}
                                minDate={fromDate}
                                renderInput={(params) => <TextField fullWidth onKeyDown={onKeyDown} fullWidth {...params} />}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <EventIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                disableMaskedInput
                                inputFormat="dd MMMM yyyy"
                            />
                        )}

                        <FormControl fullWidth>
                            <InputLabel>Time</InputLabel>
                            <Select
                                value={toTime}
                                label="Time"
                                onChange={(e) => setToTime(e.target.value)}
                                fullWidth
                                disabled={!fromTime}
                                onClose={() => {
                                    setTimeout(() => {
                                        document.activeElement.blur()
                                    }, 0)
                                }}
                            >
                                {PREFER_TIME_OPTIONS.map((time, index) => (
                                    (fromDate.getTime() === toDate.getTime() ? (time > fromTime) && (
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
                                    ) : (
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
                                    ))
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Box>
            )}

            {fromDate && toDate && toDate.getTime() >= fromDate.getTime() && (
                <>
                    <Typography sx={{ mt: 1, mb: 2 }}>Total leaving duration</Typography>
                    <Stack direction="row" justifyContent="flex-start" spacing={3} sx={{ mb: 2 }}>
                        <Stack direction="column">
                            <Typography>{`${getTotalDays()} ${`Day(s)`}`}</Typography>
                        </Stack>
                        <Stack direction="column">
                            <Typography>{`${fromTime && toTime ? getTotalHours() : '0'} ${`Hour(s)`}`}</Typography>
                        </Stack>
                    </Stack>

                    <Typography>{`Remarks (Optional)`}</Typography>
                    <TextField
                        fullWidth
                        value={remarks}
                        onChange={(event) => setRemarks(event.target.value)}
                        multiline
                        rows={3}
                        sx={{
                            mt: 1
                        }}
                    />

                    <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
                        <Button fullWidth size="large" variant="contained" color="primary" onClick={() => setOpenConfirmDialog(true)}>Submit</Button>
                    </Stack>

                    <ConfirmDialog
                        open={openConfirmDialog}
                        onClose={() => setOpenConfirmDialog(false)}
                        data={{ type: 'Custom Hour', fromDate, toDate, fromTime, toTime, remarks }}
                    />
                </>
            )}
        </>
    )
}

// ----------------------------------------------------------------

ConfirmDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    data: PropTypes.object
};

export function ConfirmDialog({ open, onClose, data }) {

    const handleSubmit = () => {
        console.log(data);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ mx: 'auto', pb: 0 }}>
                <MarkEmailReadIcon sx={{ fontSize: '100px' }} />
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" align="center" sx={{ fontWeight: 'bold', fontSize: 'h5.fontSize', mb: 1 }}>
                    Submit Leaving Request?
                </Typography>
                <Typography align="center">
                    If you submit, your request will be considered by Office Admin.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button fullWidth variant="outlined" color="inherit" onClick={onClose}>Cancel</Button>
                <LoadingButton fullWidth variant="contained" color="primary" onClick={handleSubmit}>Submit</LoadingButton>
            </DialogActions>
        </Dialog>
    )
}
import PropTypes from 'prop-types';
import { useState } from 'react';
import moment from 'moment';
// @mui
import {
    Grid,
    Typography,
    TextField,
    Button,
    Paper,
    Stack,
    Dialog,
    DialogActions,
    IconButton,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import EventNoteIcon from '@mui/icons-material/EventNote';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// utils
import { fDate } from '../../utils/formatTime'
// components
import Scrollbar from '../../components/scrollbar/Scrollbar';

// ----------------------------------------------------------------

ViewStudentCourse.propTypes = {
    student: PropTypes.object
}

export default function ViewStudentCourse({ student }) {

    const mockupCourse = {
        course: 'SAT',
        subject: 'VERBAL',
        level: 'REGULAR',
        type: 'Private',
        section: 'Hong',
        method: 'Onsite',
        totalHour: '20',
        hourPerClass: '2',
        startDate: '01 Mar 2023',
        endDate: '31 Mar 2023',
        primaryTeacher: 'KWAN',
        preferredDay: [
            { day: 'Wednesday', fromTime: '10:00', toTime: '12:00' },
            { day: 'Friday', fromTime: '10:00', toTime: '12:00' },
            { day: 'Friday', fromTime: '10:00', toTime: '12:00' },
            { day: 'Friday', fromTime: '10:00', toTime: '12:00' },
            { day: 'Friday', fromTime: '10:00', toTime: '12:00' },
        ],
        schedule: [
            { date: '01 Mar 2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '03 Mar 2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '08 Mar 2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '10 Mar 2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '15 Mar 2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '17 Mar 2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '22 Mar 2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '24 Mar 2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '29 Mar 2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '31 Mar 2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
        ],
    }

    const mockupCourse2 = {
        course: 'GED',
        subject: 'MATH',
        level: 'REGULAR',
        type: 'Semi Private',
        section: 'Haw',
        method: 'Onsite',
        totalHour: '20',
        hourPerClass: '2',
        startDate: '07 Mar 2023',
        endDate: '28 Mar 2023',
        primaryTeacher: 'BOY',
        preferredDay: [
            { day: 'Tuesday', fromTime: '10:00', toTime: '12:00' },
            { day: 'Thursday', fromTime: '10:00', toTime: '12:00' },
        ],
        schedule: [
            { date: '07 Mar 2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'BOY' },
            { date: '14 Mar 2023', fromTime: '10:00', toTime: '12:00', method: 'Online', teacher: 'BOY' },
            { date: '21 Mar 2023', fromTime: '10:00', toTime: '12:00', method: 'Online', teacher: 'BOY' },
            { date: '28 Mar 2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'BOY' }
        ]
    }

    const { user } = useAuthContext()

    const {
        role
    } = user;

    const [selectedCourse, setSelectedCourse] = useState({});
    const [openViewEditSchedule, setOpenViewEditSchedule] = useState(false);

    const handleSelect = async (course) => {
        await setSelectedCourse(course)
        setOpenViewEditSchedule(true);
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Typography variant="h6">
                        Registered Course
                    </Typography>
                </Grid>

                <Grid item xs={12} md={12}>
                    <Stack direction="column" spacing={2}>
                        <ClassPaper _course={mockupCourse} onSelect={handleSelect} role={role} />
                        <ClassPaper _course={mockupCourse2} onSelect={handleSelect} role={role} />
                    </Stack>
                </Grid>
            </Grid>
            <ViewEditScheduleDialog
                open={openViewEditSchedule}
                onClose={() => setOpenViewEditSchedule(false)}
                selectedCourse={selectedCourse}
                role={role}
            />
        </>
    )
}

// ----------------------------------------------------------------

ClassPaper.propTypes = {
    _course: PropTypes.object,
    onSelect: PropTypes.func,
    role: PropTypes.string
}

export function ClassPaper({ _course, onSelect, role }) {

    const {
        course,
        subject,
        level,
        type,
        section
    } = _course;

    return (
        <Paper variant="elevation" elevation={2} sx={{ p: 3 }}>
            <Grid container direction="row" spacing={2}>
                <Grid item xs={12} md={3.5}>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Course"
                        defaultValue={`${course} ${subject} ${level}`}
                    />
                </Grid>
                <Grid item xs={12} md={2.875}>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Type"
                        defaultValue={type}
                    />
                </Grid>
                <Grid item xs={12} md={2.875}>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Section"
                        defaultValue={section}
                    />
                </Grid>
                <Grid item xs={12} md>
                    <Button fullWidth variant="contained" color="inherit" sx={{ height: 56 }} onClick={() => onSelect(_course)}>
                        {role === 'Education Admin' ? (
                            <>
                                <EditIcon sx={{ mr: 1 }} />
                                Edit schedule
                            </>
                        ) : (
                            <>
                                <EventNoteIcon sx={{ mr: 1 }} />
                                schedule
                            </>
                        )
                        }
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

// ----------------------------------------------------------------

ViewEditScheduleDialog.propTypes = {
    selectedCourse: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    role: PropTypes.string
}

export function ViewEditScheduleDialog({ selectedCourse, open, onClose, role }) {

    const {
        schedule,
        preferredDay
    } = selectedCourse;


    // const handleSubmit = async (data) => {

    // }

    return (
        <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}
            PaperProps={{
                sx: {
                    '&::-webkit-scrollbar': { display: 'none' },
                    // height: '100%'
                }
            }}
        >
            {/* <Grid container direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, pt: 2 }}>
                <Typography variant="h6"> Edit Schedule </Typography>
                <IconButton variant="h6" onClick={onClose}> <CloseIcon /> </IconButton>
            </Grid> */}

            <Grid container direction="row" alignItems="flex-start" sx={{ px: 3, pt: 3 }} spacing={2}>
                <CourseInfo selectedCourse={selectedCourse} />
                <ScheduleInfo schedule={schedule} preferredDay={preferredDay} role={role} />
            </Grid>

            {role === 'Education Admin' ? (
                <DialogActions>
                    <Button variant="outlined" color="inherit" onClick={onClose}>Cancel</Button>
                    <Button variant="contained" color="primary">Save Changes</Button>
                </DialogActions>
            ) : (
                <DialogActions>
                    <Button variant="outlined" color="inherit" onClick={onClose}>Close</Button>
                </DialogActions>
            )}
        </Dialog>
    )
}

// ----------------------------------------------------------------

CourseInfo.propTypes = {
    selectedCourse: PropTypes.object
}

export function CourseInfo({ selectedCourse }) {

    const {
        course,
        subject,
        level,
        type,
        section,
        method,
        totalHour,
        hourPerClass,
        primaryTeacher,
        preferredDay,
        startDate,
        endDate
    } = selectedCourse;

    const customTextFieldStyle = {
        fontSize: '0.9rem'
    }

    return (
        
        <Grid item xs={12} md={5}>
            <Grid item xs={12} md={12} sx={{ mb: 2 }}>
                <Typography variant="h6"> Course Information </Typography>
            </Grid>

            <Stack direction="row" sx={{ mb: 2 }}>
                <Grid container direction="row" spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            defaultValue={type}
                            label="Course Type"
                            disabled
                            InputProps={{
                                style: customTextFieldStyle
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            defaultValue={`${course} ${subject} ${level}`}
                            label="Course"
                            disabled
                            InputProps={{
                                style: customTextFieldStyle
                            }}
                        />
                    </Grid>
                </Grid>
            </Stack>

            <Stack direction="row" sx={{ mb: 2 }}>
                <Grid container direction="row" spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            defaultValue={method}
                            label="Learning Method"
                            disabled
                            InputProps={{
                                style: customTextFieldStyle
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            defaultValue={totalHour}
                            label="Total Hours"
                            disabled
                            InputProps={{
                                style: customTextFieldStyle
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            defaultValue={hourPerClass}
                            label="Hours/Class"
                            disabled
                            InputProps={{
                                style: customTextFieldStyle
                            }}
                        />
                    </Grid>
                </Grid>
            </Stack>

            <Stack direction="row">
                <Grid container direction="row" spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={startDate}
                            label="Start Date"
                            disabled
                            InputProps={{
                                style: customTextFieldStyle
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={endDate}
                            label="End Date"
                            disabled
                            InputProps={{
                                style: customTextFieldStyle
                            }}
                        />
                    </Grid>
                </Grid>
            </Stack>

            <Stack direction="row">
                <Typography variant="inherit" sx={{ color: 'text.disabled', mt: 2, mb: 2, ml: 0.5 }}>Preferred Days</Typography>
            </Stack>

            <Stack direction="row" sx={{ mb: 2 }}>
                <Grid container direction="row" spacing={2}>
                    {preferredDay.map((eachDay, index) => (
                        <Grid item xs={6} md={3} key={index}>
                            <TextField
                                fullWidth
                                label={eachDay.day}
                                value={`${eachDay.fromTime} - ${eachDay.toTime}`}
                                disabled
                                InputProps={{
                                    style: { fontSize: '0.8rem' }
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Stack>

            <Stack direction="row" sx={{ mt: 3 }}>
                <Grid item xs={12} md={12}>
                    <TextField
                        fullWidth
                        value={primaryTeacher}
                        label="Primary Teacher"
                        SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                        disabled
                        InputProps={{
                            style: customTextFieldStyle
                        }}
                    />
                </Grid>
            </Stack>

        </Grid>
    )
}

// ----------------------------------------------------------------

ScheduleInfo.propTypes = {
    schedule: PropTypes.array,
    preferredDay: PropTypes.array,
    role: PropTypes.string
}

export function ScheduleInfo({ schedule, preferredDay, role }) {

    let rowAccumulatedHours = 0;

    function totalAccumulatedHours() {
        let HoursCount = 0;
        schedule.forEach((eachSchedule) => {
            const timeA = moment([eachSchedule.fromTime.slice(0, 2), eachSchedule.fromTime.slice(3, 5)], "HH:mm")
            const timeB = moment([eachSchedule.toTime.slice(0, 2), eachSchedule.toTime.slice(3, 5)], "HH:mm")
            HoursCount += timeB.diff(timeA, 'hours');
        })
        return HoursCount;
    }

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Tables ---------------------------------------------------------------------------------
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.divider,
            color: theme.palette.common.black,
            fontSize: '0.7rem',
            border: `1px solid ${theme.palette.divider}`,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: '0.7rem',
            padding: (role === 'Education Admin' ? 5 : 15),
            border: `1px solid ${theme.palette.divider}`,

        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:last-child td, &:last-child th': {
            backgroundColor: theme.palette.divider,
            padding: 16,
            fontWeight: 600,
            border: `1px solid ${theme.palette.divider}`,
        },
    }));

    return (
        <Grid item xs={12} md={7}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pr: 1.5, mb: 1 }}>
                <Typography variant="h6"> Classes & Schedules </Typography>
                {role === 'Education Admin' && (
                    <Button variant="text">
                        <AddIcon sx={{ mr: 0.5 }} />
                        Add Class
                    </Button>
                )}
            </Stack>
            <Scrollbar sx={{ maxHeight: '28.1rem', pr: 1.5 }}>
                {!!schedule.length && (
                    <TableContainer component={Paper}>
                        <Table sx={{ width: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">No.</StyledTableCell>
                                    <StyledTableCell align="center">Day</StyledTableCell>
                                    <StyledTableCell align="center">Date</StyledTableCell>
                                    <StyledTableCell colSpan={2} align="center">Time</StyledTableCell>
                                    <StyledTableCell align="center">Method</StyledTableCell>
                                    <StyledTableCell align="center">Teacher</StyledTableCell>
                                    <StyledTableCell align="center">Hours</StyledTableCell>
                                    {role === 'Education Admin' && (
                                        <StyledTableCell align="center" />
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {schedule.map((row, index) => {
                                    const timeA = moment([row.fromTime.slice(0, 2), row.fromTime.slice(3, 5)], "HH:mm")
                                    const timeB = moment([row.toTime.slice(0, 2), row.toTime.slice(3, 5)], "HH:mm")
                                    rowAccumulatedHours += timeB.diff(timeA, 'hours');
                                    return (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell component="th" scope="row" align="center">
                                                {(index + 1).toString()}
                                            </StyledTableCell>
                                            <StyledTableCell align="center"> {weekdays[new Date(row.date).getDay()].slice(0, 3)} </StyledTableCell>
                                            <StyledTableCell align="center">{fDate(row.date)}</StyledTableCell>
                                            <StyledTableCell align="center">{row.fromTime} - {row.toTime}</StyledTableCell>
                                            <StyledTableCell sx={{ width: '8%' }} align="center">{timeB.diff(timeA, 'hours')}</StyledTableCell>
                                            <StyledTableCell align="center">{row.method}</StyledTableCell>
                                            <StyledTableCell align="center">{`${row.teacher.toUpperCase()}`} {!!row.teacher.workTimeType && `(${row.teacher.workTimeType})`}</StyledTableCell>
                                            <StyledTableCell align="center">{rowAccumulatedHours.toString()}</StyledTableCell>
                                            {role === 'Education Admin' && (
                                                <StyledTableCell align="center" >
                                                    <IconButton onClick={() => console.log("Hi")}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </StyledTableCell>
                                            )}
                                        </StyledTableRow>
                                    )
                                })}
                                <StyledTableRow>
                                    <StyledTableCell colSpan={7} align="center">TOTAL</StyledTableCell>
                                    <StyledTableCell align="center">{totalAccumulatedHours()}</StyledTableCell>
                                    {role === 'Education Admin' && (
                                        <StyledTableCell />
                                    )}
                                </StyledTableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Scrollbar>
        </Grid>
    )
}

// ----------------------------------------------------------------

// EditClassDialog.propTypes = {
//     class: PropTypes.array
// }

// export function EditClassDialog({ class }) {
//     return (

//     )
// }
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router';
import _ from 'lodash';
// form
import { useForm, Controller } from 'react-hook-form';
// @mui
import {
    Grid,
    Typography,
    TextField,
    Button,
    Paper,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    MenuItem,
    Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import EventNoteIcon from '@mui/icons-material/EventNote';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// utils
import { fDate } from '../../utils/formatTime'
// components
import { useSnackbar } from '../../components/snackbar';
import Scrollbar from '../../components/scrollbar/Scrollbar';
import FormProvider, { RHFSelect } from '../../components/hook-form';

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
            { date: '01-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '03-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '08-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '10-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '15-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '17-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '22-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '24-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '29-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
            { date: '31-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'KWAN' },
        ],
    }

    const mockupCourse2 = {
        course: 'GED',
        subject: 'MATH',
        level: 'REGULAR',
        type: 'Semi Private',
        section: 'Haw',
        method: 'Onsite',
        totalHour: '10',
        hourPerClass: '2',
        startDate: '07 Mar 2023',
        endDate: '28 Mar 2023',
        primaryTeacher: 'BOY',
        preferredDay: [
            { day: 'Tuesday', fromTime: '10:00', toTime: '12:00' },
            { day: 'Thursday', fromTime: '10:00', toTime: '12:00' },
        ],
        schedule: [
            { date: '07-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'BOY' },
            { date: '14-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Online', teacher: 'BOY' },
            { date: '21-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Online', teacher: 'BOY' },
            { date: '28-Mar-2023', fromTime: '10:00', toTime: '12:00', method: 'Onsite', teacher: 'BOY' }
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
                    <Typography variant="">
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
            {
                Object.keys(selectedCourse).length !== 0 && (
                    <ViewEditScheduleDialog
                        open={openViewEditSchedule}
                        onClose={() => setOpenViewEditSchedule(false)}
                        selectedCourse={selectedCourse}
                        role={role}
                    />
                )
            }
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
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const {
        schedule,
        preferredDay
    } = selectedCourse;

    const [currentSchedule, setCurrentSchedule] = useState(selectedCourse.schedule);

    useEffect(() => {
        setCurrentSchedule(schedule);
    }, [schedule])

    const handleAddClass = (newClass) => {
        const newSchedule = [...currentSchedule, newClass];
        setCurrentSchedule(newSchedule.sort((class1, class2) => new Date(class1.date).getTime() - new Date(class2.date).getTime()));
    };

    const handleEditClass = (classIndex, newClass) => {
        const newSchedule = [...currentSchedule];
        newSchedule[classIndex] = newClass;
        setCurrentSchedule(newSchedule.sort((class1, class2) => new Date(class1.date).getTime() - new Date(class2.date).getTime()));
    }

    const handleDeleteClass = (classIndex) => {
        const newSchedule = [...currentSchedule];
        newSchedule.splice(classIndex, 1);
        setCurrentSchedule(newSchedule.sort((class1, class2) => new Date(class1.date).getTime() - new Date(class2.date).getTime()));
    }

    const handleSaveChange = () => {
        const totalHour = calculateTotalHour(currentSchedule);
        if (totalHour !== parseInt(selectedCourse.totalHour, 10)) {
            return enqueueSnackbar(`Total hours is invalid. Must be ${selectedCourse.totalHour} hours`, { variant: 'error' });
        }
        console.log(currentSchedule);
        // If schedule is not changed once saved then we must reload the page
        // navigate(0);
        onClose();
        return enqueueSnackbar('Schedule saved', { variant: 'success' });

    };

    const calculateTotalHour = (schedule) => {
        let HoursCount = 0;
        schedule.forEach((eachSchedule) => {
            const timeA = moment([eachSchedule.fromTime.slice(0, 2), eachSchedule.fromTime.slice(3, 5)], "HH:mm")
            const timeB = moment([eachSchedule.toTime.slice(0, 2), eachSchedule.toTime.slice(3, 5)], "HH:mm")
            HoursCount += timeB.diff(timeA, 'hours');
        })
        return HoursCount;
    };

    return (
        <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>
            {currentSchedule !== undefined && (
                <Grid container direction="row" alignItems="flex-start" sx={{ px: 3, pt: 3 }} spacing={2}>
                    <CourseInfo selectedCourse={selectedCourse} />
                    <ScheduleInfo
                        schedule={currentSchedule}
                        preferredDay={preferredDay}
                        role={role}
                        onAdd={handleAddClass}
                        onEdit={handleEditClass}
                        onDelete={handleDeleteClass}
                    />
                </Grid>
            )}

            {role === 'Education Admin' ? (
                <DialogActions>
                    <Button variant="outlined" color="inherit" onClick={onClose}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleSaveChange}>Save Changes</Button>
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
                            defaultValue={`${course} ${subject} ${level}`}
                            label="Course"
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
                            defaultValue={type}
                            label="Type"
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
                <Typography sx={{ color: 'text.disabled', fontSize: 'h1', mt: 2, mb: 2, ml: 0.5 }}>
                    Preferred Days
                </Typography>
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
    role: PropTypes.string,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
}

export function ScheduleInfo({ schedule, role, onAdd, onEdit, onDelete }) {

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

    // Add Class
    const [openAddClassDialog, setOpenAddClassDialog] = useState(false);

    // Edit Class
    const [openEditClassDialog, setOpenEditClassDialog] = useState(false);
    const [selectedClass, setSelectedClass] = useState({});
    const [selectedClassIndex, setSelectedClassIndex] = useState(null);

    const handleOpenEditClassDialog = (classIndex, selectedClass) => {
        setSelectedClass(selectedClass);
        setSelectedClassIndex(classIndex);
        setOpenEditClassDialog(true);
    }

    const handleCloseEditClassDialog = () => {
        setSelectedClass({});
        setSelectedClassIndex(null);
        setOpenEditClassDialog(false);
    }

    return (
        <Grid item xs={12} md={7}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pr: 1.5, mb: 1 }}>
                <Typography variant="h6"> Classes & Schedules </Typography>
                {role === 'Education Admin' && (
                    <Button variant="text" onClick={() => setOpenAddClassDialog(true)}>
                        <AddIcon sx={{ mr: 0.5 }} /> Add Class
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
                                {schedule.map((eachClass, index) => {
                                    const timeA = moment([eachClass.fromTime.slice(0, 2), eachClass.fromTime.slice(3, 5)], "HH:mm")
                                    const timeB = moment([eachClass.toTime.slice(0, 2), eachClass.toTime.slice(3, 5)], "HH:mm")
                                    rowAccumulatedHours += timeB.diff(timeA, 'hours');
                                    return (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell component="th" scope="row" align="center">
                                                {(index + 1).toString()}
                                            </StyledTableCell>
                                            <StyledTableCell align="center"> {weekdays[new Date(eachClass.date).getDay()].slice(0, 3)} </StyledTableCell>
                                            <StyledTableCell align="center">{fDate(eachClass.date)}</StyledTableCell>
                                            <StyledTableCell align="center">{eachClass.fromTime} - {eachClass.toTime}</StyledTableCell>
                                            <StyledTableCell sx={{ width: '8%' }} align="center">{timeB.diff(timeA, 'hours')}</StyledTableCell>
                                            <StyledTableCell align="center">{eachClass.method}</StyledTableCell>
                                            <StyledTableCell align="center">{`${eachClass.teacher.toUpperCase()}`} {!!eachClass.teacher.workTimeType && `(${eachClass.teacher.workTimeType})`}</StyledTableCell>
                                            <StyledTableCell align="center">{rowAccumulatedHours.toString()}</StyledTableCell>
                                            {role === 'Education Admin' && (
                                                <StyledTableCell align="center" >
                                                    <IconButton onClick={() => handleOpenEditClassDialog(index, eachClass)}>
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

            <AddClassDialog
                open={openAddClassDialog}
                onClose={() => setOpenAddClassDialog(false)}
                onAdd={onAdd}
            />

            {Object.keys(selectedClass).length > 0 && (
                <EditClassDialog
                    open={openEditClassDialog}
                    onClose={handleCloseEditClassDialog}
                    selectedClass={selectedClass}
                    selectedClassIndex={selectedClassIndex}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}
        </Grid>
    )
}

// ----------------------------------------------------------------

AddClassDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onAdd: PropTypes.func
}

export function AddClassDialog({ open, onClose, onAdd }) {

    // fetch all teachers
    const TEACHER_OPTIONS = [
        { fullName: 'John Smith', nickname: 'Tar' },
        { fullName: 'John Smite', nickname: 'Keen' },
        { fullName: 'Jane Smoke', nickname: 'Kwan' }
    ];

    // fetch available time of specific teacher
    const TIME_OPTIONS = [
        '10:00-12:00', '13:00-15:00', '16:00-18:00'
    ];

    // don't fetch
    const METHOD_OPTIONS = [
        'Onsite', 'Online'
    ];

    const defaultValues = {
        classDate: '',
        classTime: '',
        classTeacher: '',
        classMethod: 'Onsite'
    };

    const methods = useForm({
        defaultValues
    });

    const {
        control,
        reset,
        handleSubmit
    } = methods;

    const onSubmit = (data) => {
        const newClass = {
            date: fDate(data.classDate),
            fromTime: data.classTime.slice(0, 5),
            toTime: data.classTime.slice(6, 11),
            method: data.classMethod,
            teacher: data.classTeacher.toUpperCase()
        };

        onAdd(newClass);
        onClose();
        setTimeout(() => {
            reset(defaultValues);
        }, 200)
    }

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle sx={{ pb: 0 }}>Add Class</DialogTitle>
                <DialogContent>
                    <Grid container direction="row" sx={{ mt: 1, mb: 2 }} spacing={2}>

                        <Grid item xs={12} md={3}>
                            <Controller
                                name="classDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Date"
                                        value={field.value}
                                        onChange={(newValue) => {
                                            field.onChange(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} fullWidth error={!!error} helperText={error?.message} required />
                                        )}
                                        disableMaskedInput
                                        inputFormat="dd-MMM-yyyy"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <RHFSelect
                                fullWidth
                                name="classTime"
                                label="Time"
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                required>
                                {TIME_OPTIONS.map((eachTime, index) => (
                                    <MenuItem
                                        key={index}
                                        value={eachTime}
                                        sx={{
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            textTransform: 'capitalize',
                                            '&:first-of-type': { mt: 0 },
                                            '&:last-of-type': { mb: 0 },
                                        }}
                                    >
                                        {eachTime}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <RHFSelect
                                fullWidth
                                name="classTeacher"
                                label="Teacher"
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                required>
                                {TEACHER_OPTIONS.map((eachTeacher, index) => (
                                    <MenuItem
                                        key={index}
                                        value={eachTeacher.nickname}
                                        sx={{
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            textTransform: 'capitalize',
                                            '&:first-of-type': { mt: 0 },
                                            '&:last-of-type': { mb: 0 },
                                        }}
                                    >
                                        {`${eachTeacher.nickname.toUpperCase()} (${eachTeacher.fullName})`}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <RHFSelect
                                fullWidth
                                name="classMethod"
                                label="Learning Method"
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                required>
                                {METHOD_OPTIONS.map((eachMethod, index) => (
                                    <MenuItem
                                        key={index}
                                        value={eachMethod}
                                        sx={{
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            textTransform: 'capitalize',
                                            '&:first-of-type': { mt: 0 },
                                            '&:last-of-type': { mb: 0 },
                                        }}
                                    >
                                        {eachMethod}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="inherit" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Add
                    </Button>
                </DialogActions>
            </FormProvider>
        </Dialog>
    )
}

// ----------------------------------------------------------------

EditClassDialog.propTypes = {
    selectedClass: PropTypes.object,
    selectedClassIndex: PropTypes.number,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
}

export function EditClassDialog({ selectedClass, selectedClassIndex, open, onClose, onEdit, onDelete }) {

    const {
        date,
        fromTime,
        toTime,
        method,
        teacher
    } = selectedClass;

    // fetch all teachers
    const TEACHER_OPTIONS = [
        { fullName: 'John Smith', nickname: 'Tar' },
        { fullName: 'John Smite', nickname: 'Keen' },
        { fullName: 'Jane Smoke', nickname: 'Kwan' }
    ];

    // fetch available time of specific teacher
    const TIME_OPTIONS = [
        '10:00-12:00', '13:00-15:00', '16:00-18:00'
    ];

    // don't fetch
    const METHOD_OPTIONS = [
        'Onsite', 'Online'
    ];

    const defaultValues = {
        classDate: date,
        classTime: fromTime.concat('-', toTime),
        classTeacher: _.capitalize(teacher),
        classMethod: method
    };

    const methods = useForm({
        defaultValues
    });

    const {
        control,
        reset,
        handleSubmit
    } = methods;

    const onSubmit = (data) => {
        const newClass = {
            date: fDate(data.classDate),
            fromTime: data.classTime.slice(0, 5),
            toTime: data.classTime.slice(6, 11),
            method: data.classMethod,
            teacher: data.classTeacher.toUpperCase()
        };

        onEdit(selectedClassIndex, newClass);
        onClose();
    };

    const handleDeleteClass = () => {
        onDelete(selectedClassIndex);
        onClose();
    }

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle sx={{ pb: 0 }}>Edit Class</DialogTitle>
                <DialogContent>
                    <Grid container direction="row" sx={{ mt: 1, mb: 2 }} spacing={2}>

                        <Grid item xs={12} md={3}>
                            <Controller
                                name="classDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Date"
                                        value={field.value}
                                        onChange={(newValue) => {
                                            field.onChange(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} fullWidth error={!!error} helperText={error?.message} required />
                                        )}
                                        disableMaskedInput
                                        inputFormat="dd-MMM-yyyy"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <RHFSelect
                                fullWidth
                                name="classTime"
                                label="Time"
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                required>
                                {TIME_OPTIONS.map((eachTime, index) => (
                                    <MenuItem
                                        key={index}
                                        value={eachTime}
                                        sx={{
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            textTransform: 'capitalize',
                                            '&:first-of-type': { mt: 0 },
                                            '&:last-of-type': { mb: 0 },
                                        }}
                                    >
                                        {eachTime}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <RHFSelect
                                fullWidth
                                name="classTeacher"
                                label="Teacher"
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                required>
                                {TEACHER_OPTIONS.map((eachTeacher, index) => (
                                    <MenuItem
                                        key={index}
                                        value={eachTeacher.nickname}
                                        sx={{
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            textTransform: 'capitalize',
                                            '&:first-of-type': { mt: 0 },
                                            '&:last-of-type': { mb: 0 },
                                        }}
                                    >
                                        {`${eachTeacher.nickname.toUpperCase()} (${eachTeacher.fullName})`}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <RHFSelect
                                fullWidth
                                name="classMethod"
                                label="Learning Method"
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                required>
                                {METHOD_OPTIONS.map((eachMethod, index) => (
                                    <MenuItem
                                        key={index}
                                        value={eachMethod}
                                        sx={{
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            textTransform: 'capitalize',
                                            '&:first-of-type': { mt: 0 },
                                            '&:last-of-type': { mb: 0 },
                                        }}
                                    >
                                        {eachMethod}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "space-between" }}>
                    <Button variant="contained" color="error" onClick={handleDeleteClass}>
                        Delete
                    </Button>
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" color="inherit" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            Edit
                        </Button>
                    </Stack>
                </DialogActions>
            </FormProvider>
        </Dialog>
    )
}
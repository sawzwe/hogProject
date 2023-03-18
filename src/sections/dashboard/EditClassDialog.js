import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { useNavigate } from 'react-router';
// form
import { useForm, Controller } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import CircularProgress from '@mui/material/CircularProgress';
import {
    Fade,
    TextField,
    Grid,
    Stack,
    Card,
    Box,
    Dialog,
    Paper,
    Typography,
    Button,
    IconButton,
    MenuItem,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// utils
import { fDate } from '../../utils/formatTime'
// components
import { useSnackbar } from '../../components/snackbar';
import Scrollbar from '../../components/scrollbar/Scrollbar';
import FormProvider, { RHFSelect } from '../../components/hook-form';
//
import { HOG_API } from '../../config';
// ----------------------------------------------------------------------

EditClassDialog.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    schedule: PropTypes.object,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    hourPerClass: PropTypes.number,
    fromDate: PropTypes.string,
    toDate: PropTypes.string,
    students: PropTypes.array,
    courseCustom: PropTypes.bool
}

export function EditClassDialog({ open, close, schedule, onEdit, onDelete, hourPerClass, fromDate, toDate, students, courseCustom = false }) {

    const METHOD_OPTIONS = [
        'Onsite', 'Online'
    ];

    // console.log(schedule);

    const [isLoadingTime, setIsLoadingTime] = useState(false);
    const [isLoadingTeacher, setIsLoadingTeacher] = useState(false);
    const [availableTime, setAvailableTime] = useState();
    const [availableTeacher, setAvailableTeacher] = useState();

    const {
        date,
        fromTime,
        toTime,
        teacher,
        method,
    } = schedule;

    const defaultValues = {
        classDate: date,
        classTime: fromTime.concat('-', toTime),
        classTeacher: teacher.id,
        classMethod: _.capitalize(method)
    };

    const methods = useForm({
        defaultValues
    });

    const {
        watch,
        control,
        setValue,
        reset,
        handleSubmit,
    } = methods;

    const values = watch();

    const handleChangeDate = async (newDate) => {
        resetValue();
        setValue('classDate', newDate);
        setIsLoadingTime(true);
        let studentList = "";
        students.forEach((eachStudent, index) => {
            studentList = studentList.concat(`listOfStudentId=${eachStudent.studentId}`, '&')
        })

        // console.log(students);

        try {
            // console.log(`${HOG_API}/api/CheckAvailable/GetAvailableTime?${studentList}date=${fDate(newDate, 'dd-MMMM-yyyy')}&hour=${hourPerClass}`)
            if (courseCustom) {
                axios(`${HOG_API}/api/CheckAvailable/GetAvailableTime?${studentList}date=${fDate(newDate, 'dd-MMM-yyyy')}&hour=${hourPerClass}&classId=${schedule.id}`)
                    .then(((res) => {
                        setAvailableTime(res.data.data)
                        setIsLoadingTime(false);
                    }))
                    .catch((error) => {
                        throw error;
                    })
            } else {
                axios(`${HOG_API}/api/CheckAvailable/GetAvailableTime?${studentList}date=${fDate(newDate, 'dd-MMM-yyyy')}&hour=${hourPerClass}&classId=0`)
                    .then(((res) => {
                        setAvailableTime(res.data.data)
                        setIsLoadingTime(false);
                    }))
                    .catch((error) => {
                        throw error;
                    })
            }
        } catch (error) {
            console.error(error);
            setIsLoadingTime(false);
        }
    }

    const handleChangeTime = async (newTime) => {
        setAvailableTeacher();
        setValue('classTime', newTime);
        setValue('classTeacher', '')

        setIsLoadingTeacher(true);
        try {
            const fromTime = newTime.slice(0, 5).replace(":", "%3A");
            const toTime = newTime.slice(6, 11).replace(":", "%3A");
            // console.log(`${HOG_API}/api/CheckAvailable/GetAvailableTeacher?fromTime=${fromTime}&toTime=${toTime}&date=${fDate(values.classDate, 'dd-MMM-yyyy')}`)

            if (courseCustom) {
                axios(`${HOG_API}/api/CheckAvailable/GetAvailableTeacher?fromTime=${fromTime}&toTime=${toTime}&date=${fDate(values.classDate, 'dd-MMM-yyyy')}&classId=${schedule.id}`)
                    .then(((res) => {
                        setAvailableTeacher(res.data.data)
                        setIsLoadingTeacher(false);
                    }))
                    .catch((error) => {
                        throw error;
                    })
            } else {
                axios(`${HOG_API}/api/CheckAvailable/GetAvailableTeacher?fromTime=${fromTime}&toTime=${toTime}&date=${fDate(values.classDate, 'dd-MMM-yyyy')}&classId=0`)
                    .then(((res) => {
                        setAvailableTeacher(res.data.data)
                        setIsLoadingTeacher(false);
                    }))
                    .catch((error) => {
                        throw error;
                    })
            }
        } catch (error) {
            console.error(error);
            setIsLoadingTeacher(false);
        }
    }

    const resetValue = () => {
        setValue('classDate', '')
        setValue('classTime', '')
        setValue('classTeacher', '')
        setValue('classMethod', _.capitalize(method))
        setAvailableTime();
        setAvailableTeacher();
    }

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const handleSaveChange = (data) => {
        const newClass = {
            day: weekday[new Date(data.classDate).getDay()].slice(0, 3),
            date: data.classDate,
            hourPerClass,
            teacher: availableTeacher.find((eachTeacher) => eachTeacher.id === data.classTeacher),
            fromTime: data.classTime.slice(0, 5),
            toTime: data.classTime.slice(6, 11),
            method: data.classMethod,
            id: schedule?.id || ''
        };
        onEdit(newClass);
        // handleClose();
    }

    const handleDelete = () => {
        onDelete(schedule);
        handleClose();
    }

    const handleClose = () => {
        close();
        setTimeout(() => {
            reset();
        }, 200);
    }


    useEffect(() => {
        if (Object.keys(schedule).length) {
            setValue('classDate', date);
            handleChangeDate(date);
            setValue('classTime', fromTime.concat('-', toTime))
            handleChangeTime(fromTime.concat('-', toTime))
            setValue('classTeacher', teacher.id);
            setValue('classMethod', method);
        }
    }, [schedule])

    return (
        <Dialog fullWidth maxWidth="lg" open={open} onClose={close}>
            <FormProvider methods={methods} onSubmit={handleSubmit(handleSaveChange)}>
                <DialogTitle sx={{ pb: 0 }}>Edit Schedule</DialogTitle>
                <DialogContent>
                    <Grid container direction="row" sx={{ mt: 1, mb: 2 }} spacing={2}>
                        <Grid item xs={12} md={3}>
                            <Controller
                                name="classDate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Date"
                                        minDate={new Date(fromDate)}
                                        maxDate={new Date(toDate)}
                                        value={field.value}
                                        onChange={handleChangeDate}
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
                            {availableTime === undefined && !isLoadingTime && (
                                <TextField
                                    fullWidth
                                    label='Available Time'
                                    disabled
                                />
                            )}
                            {isLoadingTime && (
                                <TextField
                                    fullWidth
                                    label='Available Time'
                                    disabled
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Box sx={{ display: 'flex' }}>
                                                    <CircularProgress size={20} />
                                                </Box>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                            {availableTime?.length === 0 && (
                                <TextField
                                    fullWidth
                                    label='Unavailable'
                                    disabled
                                />
                            )}
                            {availableTime?.length > 0 && (
                                <RHFSelect
                                    fullWidth
                                    name="classTime"
                                    label="Available Time"
                                    SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                    onChange={(event) => handleChangeTime(event.target.value)}
                                    required>
                                    {availableTime.map((eachTime, index) => (
                                        <MenuItem
                                            key={index}
                                            value={`${eachTime?.fromTime}-${eachTime?.toTime}`}
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
                                            {`${eachTime.fromTime} - ${eachTime.toTime}`}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                            )}
                        </Grid>

                        <Grid item xs={12} md={3}>
                            {availableTeacher === undefined && !isLoadingTeacher && (
                                <TextField
                                    fullWidth
                                    label='Available Teacher'
                                    disabled
                                />
                            )}
                            {isLoadingTeacher && (
                                <TextField
                                    fullWidth
                                    label='Available Teacher'
                                    disabled
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Box sx={{ display: 'flex' }}>
                                                    <CircularProgress size={20} />
                                                </Box>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}

                            {availableTeacher?.length === 0 && (
                                <TextField
                                    fullWidth
                                    label='Unavailable'
                                    disabled
                                />
                            )}

                            {availableTeacher?.length > 0 && (
                                <RHFSelect
                                    fullWidth
                                    name="classTeacher"
                                    label="Available Teacher"
                                    SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                    required>
                                    {availableTeacher.map((eachTeacher, index) => (
                                        <MenuItem
                                            key={index}
                                            value={eachTeacher.id}
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
                            )}
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

                <Grid container justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 3 }} spacing={1.5}>
                    <Stack direction="row" sx={{ ml: 1.5 }}>
                        <Grid item>
                            <Button variant="contained" size="medium" color="error" onClick={handleDelete}>
                                Delete
                            </Button>
                        </Grid>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Grid item>
                            <Button variant="outlined" size="medium" color="inherit" onClick={handleClose}>
                                Close
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" size="medium" type="submit">
                                Save Change
                            </Button>
                        </Grid>
                    </Stack>
                </Grid>
            </FormProvider>
        </Dialog>
    )
}
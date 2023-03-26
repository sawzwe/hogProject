import PropTypes from 'prop-types';
import { useState } from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { useNavigate } from 'react-router';
// form
import { useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, Button, MenuItem } from '@mui/material';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFCheckbox, RHFSelect } from '../../../components/hook-form';
//
import SaveChangesDialog from './SaveChangesDialog';

// ----------------------------------------------------------------------
EditTeacher.propTypes = {
    currentTeacher: PropTypes.object
}

export default function EditTeacher({ currentTeacher }) {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();


    const NewEASchema = Yup.object().shape({
        role: Yup.string().required('Role is required'),
        fName: Yup.string().required('Firstname is required'),
        lName: Yup.string().required('Lastname is required'),
        nickname: Yup.string().required('Nickname is required'),
        phone: Yup.string().required('Phone number is required'),
        line: Yup.string().required('Line ID is required'),
        email: Yup.string().email('Email is invalid').required('Email is required'),
        monday: Yup.object().shape({
            fromTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                }),
            toTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                })
        }),
        tuesday: Yup.object().shape({
            fromTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                }),
            toTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                })
        }),
        wednesday: Yup.object().shape({
            fromTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                }),
            toTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                })
        }),
        thursday: Yup.object().shape({
            fromTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                }),
            toTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                })
        }),
        friday: Yup.object().shape({
            fromTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                }),
            toTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                })
        }),
        saturday: Yup.object().shape({
            fromTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                }),
            toTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                })
        }),
        sunday: Yup.object().shape({
            fromTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                }),
            toTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                })
        }),
        workingDaySlot: Yup.string()
            .when(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], {
                is: (monday, tuesday, wednesday, thursday, friday, saturday, sunday) => !monday.isSelected && !tuesday.isSelected && !wednesday.isSelected && !thursday.isSelected && !friday.isSelected && !saturday.isSelected && !sunday.isSelected,
                then: Yup.string().required("At least one working day is required"),
                otherwise: Yup.string()
            })
    });

    const [openSaveChangesDialog, setOpenSaveChangesDialog] = useState(false);


    const defaultValues = {
        id: currentTeacher?.id,
        role: 'Teacher',
        fName: currentTeacher?.fName || '',
        lName: currentTeacher?.lName || '',
        nickname: currentTeacher?.nickname || '',
        phone: currentTeacher?.phone || '',
        line: currentTeacher?.line || '',
        email: currentTeacher?.email || '',
        monday: currentTeacher.workTimes.monday.fromTime !== '' ? { isSelected: true, fromTime: currentTeacher.workTimes.monday.fromTime, toTime: currentTeacher.workTimes.monday.toTime } : { isSelected: false, fromTime: '', toTime: '' },
        tuesday: currentTeacher.workTimes.tuesday.fromTime !== '' ? { isSelected: true, fromTime: currentTeacher.workTimes.tuesday.fromTime, toTime: currentTeacher.workTimes.tuesday.toTime } : { isSelected: false, fromTime: '', toTime: '' },
        wednesday: currentTeacher.workTimes.wednesday.fromTime !== '' ? { isSelected: true, fromTime: currentTeacher.workTimes.wednesday.fromTime, toTime: currentTeacher.workTimes.wednesday.toTime } : { isSelected: false, fromTime: '', toTime: '' },
        thursday: currentTeacher.workTimes.thursday.fromTime !== '' ? { isSelected: true, fromTime: currentTeacher.workTimes.thursday.fromTime, toTime: currentTeacher.workTimes.thursday.toTime } : { isSelected: false, fromTime: '', toTime: '' },
        friday: currentTeacher.workTimes.friday.fromTime !== '' ? { isSelected: true, fromTime: currentTeacher.workTimes.friday.fromTime, toTime: currentTeacher.workTimes.friday.toTime } : { isSelected: false, fromTime: '', toTime: '' },
        saturday: currentTeacher.workTimes.saturday.fromTime !== '' ? { isSelected: true, fromTime: currentTeacher.workTimes.saturday.fromTime, toTime: currentTeacher.workTimes.saturday.toTime } : { isSelected: false, fromTime: '', toTime: '' },
        sunday: currentTeacher.workTimes.sunday.fromTime !== '' ? { isSelected: true, fromTime: currentTeacher.workTimes.sunday.fromTime, toTime: currentTeacher.workTimes.sunday.toTime } : { isSelected: false, fromTime: '', toTime: '' }
    };

    const methods = useForm({
        resolver: yupResolver(NewEASchema),
        defaultValues,
    });

    const {
        setError,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const [savedData, setSavedData] = useState({});

    const onSubmit = async (data) => {
        try {
            await setSavedData(data);
            await setOpenSaveChangesDialog(true);
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
            setError('afterSubmit', {
                ...error,
                message: error.message
            });
        }
    };

    const onError = (error) => {
        if (error.workingDaySlot) {
            enqueueSnackbar("At least one working day is required!", { variant: 'error' });
        } else {
            enqueueSnackbar("Form has not been filled correctly!", { variant: 'error' });
        }
    };

    const handleCancelEdit = () => {
        navigate(`/account/teacher-management/teacher/${currentTeacher.id}`);
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Card sx={{ p: 3 }}>
                <Typography variant="h6"
                    sx={{
                        mb: 2,
                        display: 'block',
                    }}
                >
                    Teacher detail
                </Typography>

                <Grid direction="row" container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="fName" label="First name" required />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="lName" label="Last name" required />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="nickname" label="Nickname" required />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="phone" label="Phone number" required />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="line" label="Line ID" required />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="email" label="Email" required />
                    </Grid>
                </Grid>

                <Grid direction="row" container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={12}>
                        <Typography variant="h6">
                            Working days
                        </Typography>
                    </Grid>
                </Grid>

                <Grid direction="row" container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <WorkingDay day="monday" />
                        <WorkingDay day="tuesday" />
                        <WorkingDay day="wednesday" />
                        <WorkingDay day="thursday" />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <WorkingDay day="friday" />
                        <WorkingDay day="saturday" />
                        <WorkingDay day="sunday" />
                    </Grid>


                    <Grid item xs={12} md={12}>
                        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Save changes
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Card>

            <SaveChangesDialog
                open={openSaveChangesDialog}
                onClose={() => setOpenSaveChangesDialog(false)}
                data={savedData}
                accountRole="Teacher"
            />
        </FormProvider >
    )
}

// ----------------------------------------------------------------------

WorkingDay.propTypes = {
    day: PropTypes.string,
};

export function WorkingDay({ day }) {


    const {
        watch,
        setValue,
    } = useFormContext();

    const values = watch();

    const handleClickDay = () => {
        if (values[day].isSelected) {
            setValue(`${day}`, false)
            setValue(`${day}.fromTime`, "")
            setValue(`${day}.toTime`, "")
        } else {
            setValue(`${day}.isSelected`, false)
        }
    };

    const TIME_OPTIONS = [
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00'
    ];

    return (
        <Stack direction="row" spacing={2} sx={{ mt: 2 }} justifyContent="flex-start" alignItems="center" >
            <Box sx={{ width: 50 }}>
                <RHFCheckbox name={`${day}.isSelected`} label={day.charAt(0).toUpperCase() + day.slice(1, 3)} onClick={handleClickDay} htmlFor={day} />
            </Box>
            <RHFSelect
                name={`${day}.fromTime`}
                label="From"
                size="small"
                disabled={!values[day].isSelected}
                required={values[day].isSelected}
                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
            >
                {TIME_OPTIONS.map((time) => (
                    <MenuItem
                        key={time}
                        value={time}
                        autoFocus
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
                        {time}
                    </MenuItem>
                ))}
            </RHFSelect>

            <Typography variant="inherit" > - </Typography>

            <RHFSelect
                name={`${day}.toTime`}
                label="To"
                size="small"
                disabled={!values[day].fromTime}
                required={values[day].isSelected}
                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
            >
                {TIME_OPTIONS.map((time) => {
                    const toTime = moment(time, "HH:mm")
                    const fromTime = moment(values[day].fromTime, "HH:mm")
                    if (fromTime.isBefore(toTime)) {
                        return (
                            <MenuItem
                                key={time}
                                value={time}
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
                                {time}
                            </MenuItem>
                        )
                    }
                    return null;
                })}
            </RHFSelect>
        </Stack>
    )
}
import PropTypes from 'prop-types';
import { useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router';
// form
import { useForm, useFormContext } from 'react-hook-form';
// @mui
import { Box, Card, Grid, Stack, Typography, Button, MenuItem } from '@mui/material';
// components
import FormProvider, { RHFTextField, RHFCheckbox, RHFSelect } from '../../../components/hook-form';
//
import ResetPasswordDialog from './ResetPasswordDialog';
import DeleteAccountDialog from './DeleteAccountDialog';

// ----------------------------------------------------------------------
ViewTeacher.propTypes = {
    currentTeacher: PropTypes.object
}

export default function ViewTeacher({ currentTeacher }) {
    console.log("teacher", currentTeacher)
    const navigate = useNavigate();

    const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
    const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);

    // const defaultValues = {
    //     role: 'Teacher',
    //     fName: currentTeacher?.fName || '',
    //     lName: currentTeacher?.lName || '',
    //     nickname: currentTeacher?.nickname || '',
    //     phone: currentTeacher?.phone || '',
    //     line: currentTeacher?.line || '',
    //     email: currentTeacher?.email || '',
    //     monday: currentTeacher.monday.fromTime !== '' ? { isSelected: true, fromTime: currentTeacher.monday.fromTime, toTime: currentTeacher.monday.toTime } : { isSelected: false, fromTime: '', toTime: '' },
    //     tuesday: currentTeacher.tuesday.fromTime !== '' ? { isSelected: true, fromTime: currentTeacher.tuesday.fromTime, toTime: currentTeacher.tuesday.toTime } : { isSelected: false, fromTime: '', toTime: '' },
    //     wednesday: currentTeacher.wednesday.fromTime !== '' ? { isSelected: true, fromTime: currentTeacher.wednesday.fromTime, toTime: currentTeacher.wednesday.toTime } : { isSelected: false, fromTime: '', toTime: '' },
    //     thursday: currentTeacher.thursday.fromTime !== '' ? { isSelected: true, fromTime: currentTeacher.thursday.fromTime, toTime: currentTeacher.thursday.toTime } : { isSelected: false, fromTime: '', toTime: '' },
    //     friday: currentTeacher.friday.fromTime !== '' ? { isSelected: true, fromTime: currentTeacher.friday.fromTime, toTime: currentTeacher.friday.toTime } : { isSelected: false, fromTime: '', toTime: '' },
    //     saturday: currentTeacher.saturday.fromTime !== '' ? { isSelected: true, fromTime: currentTeacher.saturday.fromTime, toTime: currentTeacher.saturday.toTime } : { isSelected: false, fromTime: '', toTime: '' },
    //     sunday: currentTeacher.sunday.fromTime !== '' ? { isSelected: true, fromTime: currentTeacher.sunday.fromTime, toTime: currentTeacher.sunday.toTime } : { isSelected: false, fromTime: '', toTime: '' }
    // };

    const defaultValues = {
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
        defaultValues,
    });

    const handleClickEdit = () => {
        navigate(`/account/teacher-management/teacher/${currentTeacher.id}/edit`);
    };

    return (
        <FormProvider methods={methods}>
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
                        <RHFTextField name="fName" label="First name" disabled />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="lName" label="Last name" disabled />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="nickname" label="Nickname" disabled />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="phone" label="Phone number" disabled />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="line" label="Line ID" disabled />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="email" label="Email" disabled />
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


                    <Grid item xs={12} md={12} sx={{ mt: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setOpenDeleteAccountDialog(true)}
                            >
                                Delete account
                            </Button>
                            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={() => setOpenResetPasswordDialog(true)}
                                >
                                    Reset password
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleClickEdit}
                                >
                                    Edit
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Card>

            <ResetPasswordDialog
                open={openResetPasswordDialog}
                onClose={() => setOpenResetPasswordDialog(false)}
                defaultPassword="hog + teacher's phone number"
            />

            <DeleteAccountDialog
                accountId={currentTeacher.id}
                accountRole={currentTeacher.role}
                accountName={currentTeacher.fName}
                open={openDeleteAccountDialog}
                onClose={() => setOpenDeleteAccountDialog(false)}
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
        resetField,
    } = useFormContext();

    const values = watch();


    const handleChange = () => {
        if (!values[day].isSelected) {
            resetField(values[day])
        } else {
            setValue(values[day].isSelected, true)
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
                <RHFCheckbox name={`${day}.isSelected`} label={day.charAt(0).toUpperCase() + day.slice(1, 3)} onChange={handleChange} disabled />
            </Box>
            <RHFSelect
                name={`${day}.fromTime`}
                label="From"
                size="small"
                disabled
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
                disabled
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
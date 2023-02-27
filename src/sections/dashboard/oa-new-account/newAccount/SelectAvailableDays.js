import PropTypes from 'prop-types';
import { useEffect } from 'react';
// form
import { useFormContext } from 'react-hook-form';
// components
import { Stack, Grid, Typography, MenuItem, Box } from '@mui/material';
// assets
import { RHFSelect, RHFCheckbox } from '../../../../components/hook-form';

const AVAILABLE_TIME_OPTIONS = [
    { value: '09:00', label: '09:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:00', label: '11:00' },
    { value: '12:00', label: '12:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
]

EachAvailableDay.propTypes = {
    day: PropTypes.string,
};

export function EachAvailableDay({ day }) {
    const {
        watch,
        setValue,
        resetField,
    } = useFormContext();

    const values = watch();

    const handleClick = () => {
        if (values[`${day}`]) {
            resetField(`${day}FromTime`)
            resetField(`${day}ToTime`)
            resetField(`${day}`)
        } else {
            setValue(`${day}`, true)
        }
    }

    useEffect(() => {
        if (values[`${day}`] && values[`${day}FromTime`] && values[`${day}ToTime`]) {
            if (values.newAvailableDays.some((eachDay) => eachDay.day !== day)) {
                setValue('newAvailableDays', [...values.newAvailableDays, { day, from: values[`${day}FromTime`], to: values[`${day}ToTime`] }])
            } else {
                values.newAvailableDays = values.newAvailableDays.filter((eachDay) => eachDay.day !== day)
                setValue('newAvailableDays', [...values.newAvailableDays, { day, from: values[`${day}FromTime`], to: values[`${day}ToTime`] }])
            }
        } else {
            setValue('newAvailableDays', values.newAvailableDays.filter((eachDay) => eachDay.day !== day))
        }
    }, [values[`${day}FromTime`], values[`${day}ToTime`]])

    return (
        <Stack direction="row" spacing={2} sx={{ pt: 2 }} alignContent="flex-start" alignItems="center" >
            <Box sx={{ width: 50 }}>
                <RHFCheckbox name={day} label={day.charAt(0).toUpperCase() + day.slice(1, 3)} sx={{ mr: 0 }} onClick={handleClick} htmlFor={day} />
            </Box>
            <RHFSelect
                name={`${day}FromTime`}
                label="From"
                size="small"
                disabled={!values[`${day}`]}
                required={values[`${day}`]}
                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
            >
                {AVAILABLE_TIME_OPTIONS.map((option) => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
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
                        {option.value}
                    </MenuItem>
                ))}
            </RHFSelect>

            <Typography variant="inherit" > - </Typography>
            <RHFSelect
                name={`${day}ToTime`}
                label="To"
                size="small"
                disabled={!values[`${day}`]}
                required={values[`${day}`]}
                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
            >
                {AVAILABLE_TIME_OPTIONS.map((option) => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
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
                        {option.value}
                    </MenuItem>
                ))}
            </RHFSelect>
        </Stack>
    )
}

export default function SelectAvailableDays() {

    return (
        <>
            <Grid container item xs={12} md={12} sx={{ pb: 0 }}>
                <Typography>Available Days</Typography>
            </Grid>
            <Grid container sx={{ pl: 3 }} spacing={3}>
                <Grid item xs={12} md={6}>
                    <EachAvailableDay day="monday" />
                    <EachAvailableDay day="tuesday" />
                    <EachAvailableDay day="wednesday" />
                    <EachAvailableDay day="thursday" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <EachAvailableDay day="friday" />
                    <EachAvailableDay day="saturday" />
                    <EachAvailableDay day="sunday" />
                </Grid>
            </Grid>
        </>
    )
}
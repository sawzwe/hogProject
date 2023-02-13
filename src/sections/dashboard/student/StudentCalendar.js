import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { TextField, InputAdornment } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import EventIcon from '@mui/icons-material/Event';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import ClassCard from '../../../components/app-card/ClassCard';

StudentCalendar.propTypes = {
    currentStudent: PropTypes.object,
};

export default function StudentCalendar({ currentStudent }) {

    const isDesktop = useResponsive('up', 'lg');

    const today = new Date(2023, 2, 13)
    const [value, setValue] = useState(today);

    const { schedules } = currentStudent;

    return (
        <>
            {isDesktop ? (
                <DesktopDatePicker
                    value={value}
                    onChange={(newValue) => {
                        setValue(newValue);
                    }}
                    minDate={today}
                    renderInput={(params) => <TextField {...params} />}
                    disableMaskedInput
                    inputFormat="dd MMMM yyyy"
                />
            ) : (
                <MobileDatePicker
                    value={value}
                    onChange={(newValue) => {
                        setValue(newValue);
                    }}
                    minDate={today}
                    renderInput={(params) => <TextField fullWidth {...params} />}
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
            {schedules.length > 0 && (
                schedules.map((schedule, index) => (new Date(schedule.date).getTime() === value.getTime() && <ClassCard key={index} schedule={schedule} />))
            )}
        </>
    )
}


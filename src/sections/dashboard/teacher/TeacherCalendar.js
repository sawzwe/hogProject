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
import CalendarClassCard from '../../../components/app-card/CalendarClassCard';

TeacherCalendar.propTypes = {
    currentTeacher: PropTypes.array,
};

export default function TeacherCalendar({ currentTeacher }) {

    const isDesktop = useResponsive('up', 'lg');

    const today = new Date();
    today.setHours(0, 0, 0, 0)
    const [value, setValue] = useState(today);

    // const { teacherPrivateClass, teacherGroupClass, teacherPrivateCourse, teacherGroupCourse } = currentTeacher;
    const teacherPrivateClass = currentTeacher;
    const onKeyDown = (e) => {
        e.preventDefault();
    };

    return (
        <>
            {isDesktop ? (
                <DesktopDatePicker
                    value={value}
                    onChange={(newValue) => {
                        setValue(newValue);
                    }}
                    minDate={today}
                    renderInput={(params) => <TextField onKeyDown={onKeyDown} {...params} />}
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
            {teacherPrivateClass.filter(eachClass => eachClass.paymentStatus === 'Complete' && new Date(eachClass.date).getTime() === value.getTime())
                .map((eachClass, index) => (
                    <CalendarClassCard key={index} accountRole='teacher' eachClass={eachClass} />
                ))
            }
            {/* {teacherPrivateClass.length > 0 && (
                teacherPrivateClass.map((eachClass, index) =>
                (new Date(eachClass.date).getTime() === value.getTime() &&
                    <CalendarClassCard key={index} accountRole='teacher' eachClass={eachClass} />))
            )} */}
            {/* {teacherGroupClass.length > 0 && (
                teacherGroupClass.map((eachClass, index) =>
                (new Date(eachClass.date).getTime() === value.getTime() &&
                    <CalendarClassCard key={index} accountRole='teacher' eachClass={eachClass} />))
            )} */}
        </>
    )
}


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

// StudentCalendar.propTypes = {
//     currentStudent: PropTypes.object,
// };
StudentCalendar.propTypes = {
    currentStudent: PropTypes.array,
};

// export default function StudentCalendar({ currentStudent }) {
export default function StudentCalendar({ currentStudent }) {
    const isDesktop = useResponsive('up', 'lg');
    // console.log('current',currentStudent)
    const today = new Date(2023, 2, 15);
    const real = new Date();
    const [value, setValue] = useState(today);
    // console.log(real)
    
    const studentPrivateClass = currentStudent;
    // const { studentPrivateClass, studentGroupClass, studentPrivateCourse, studentGroupCourse } = currentStudent;

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
            {studentPrivateClass.length > 0 && (
                studentPrivateClass.map((eachClass, index) =>
                (new Date(eachClass.date).getTime() === value.getTime() &&
                    <CalendarClassCard key={index} accountRole='student' eachClass={eachClass} />))
            )}
            {/* {studentGroupClass.length > 0 && (
                studentGroupClass.map((eachClass, index) =>
                (new Date(eachClass.date).getTime() === value.getTime() &&
                    <CalendarClassCard key={index} accountRole='student'  eachClass={eachClass} />))
            )} */}
        </>
    )
}


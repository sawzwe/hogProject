import PropTypes from 'prop-types';
import { useState } from 'react';
import { m } from 'framer-motion';
// @mui
import { TextField, InputAdornment, Container, Typography } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import EventIcon from '@mui/icons-material/Event';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import { MotionContainer, varBounce } from '../../../components/animate';
import CalendarClassCard from '../../../components/app-card/CalendarClassCard';
// assets
import { UploadIllustration } from '../../../assets/illustrations';

TeacherCalendar.propTypes = {
    currentTeacher: PropTypes.array,
};

export default function TeacherCalendar({ currentTeacher }) {
    const [todayClass, setTodayClass] = useState([]);
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
                        const filteredClass = teacherPrivateClass.filter(eachClass => eachClass.paymentStatus === 'Complete' && new Date(eachClass.date).getTime() === newValue.getTime())
                        setTodayClass(filteredClass)
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
                        const filteredClass = teacherPrivateClass.filter(eachClass => eachClass.paymentStatus === 'Complete' && new Date(eachClass.date).getTime() === newValue.getTime())
                        setTodayClass(filteredClass)
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
            {todayClass.length > 0 ? todayClass.map((eachClass, index) => (
                <CalendarClassCard key={index} accountRole='teacher' eachClass={eachClass} />
            )) : (
                <Container component={MotionContainer} sx={{ textAlign: 'center', mt: 4 }}>
                    <m.div variants={varBounce().in}>
                        <Typography variant="h3" paragraph>
                            No class
                        </Typography>
                    </m.div>

                    <m.div variants={varBounce().in}>
                        <Typography sx={{ color: 'text.secondary' }}>You have no class today!</Typography>
                    </m.div>

                    <m.div variants={varBounce().in}>
                        <UploadIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
                    </m.div>
                </Container>
            )}
            {/* {teacherPrivateClass.filter(eachClass => eachClass.paymentStatus === 'Complete' && new Date(eachClass.date).getTime() === value.getTime())
                .map((eachClass, index) => (
                    <CalendarClassCard key={index} accountRole='teacher' eachClass={eachClass} />
                ))
            } */}
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


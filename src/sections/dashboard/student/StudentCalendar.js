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
import NotFound from '../../../components/NotFound';
// assets
import { UploadIllustration } from '../../../assets/illustrations';

// StudentCalendar.propTypes = {
//     currentStudent: PropTypes.object,
// };
StudentCalendar.propTypes = {
    currentStudent: PropTypes.array,
};

// export default function StudentCalendar({ currentStudent }) {
export default function StudentCalendar({ currentStudent }) {
    const [todayClass, setTodayClass] = useState([]);

    const isDesktop = useResponsive('up', 'lg');
    // console.log('current',currentStudent)
    // const today = new Date(2023, 2, 15);
    const today = new Date();
    today.setHours(0, 0, 0, 0)
    // console.log(today)
    // console.log(real)

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
                        const filteredClass = studentPrivateClass.filter(eachClass => eachClass.paymentStatus === 'Complete' && new Date(eachClass.date).getTime() === newValue.getTime())
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
                        const filteredClass = studentPrivateClass.filter(eachClass => eachClass.paymentStatus === 'Complete' && new Date(eachClass.date).getTime() === newValue.getTime())
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
                <CalendarClassCard key={index} accountRole='student' eachClass={eachClass} />
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
            {/* {studentPrivateClass.filter(eachClass => eachClass.paymentStatus === 'Complete' && new Date(eachClass.date).getTime() === value.getTime())
                .map((eachClass, index) => (
                    <CalendarClassCard key={index} accountRole='student' eachClass={eachClass} />
                ))
            } */}

            {/* {studentPrivateClass.length > 0 && (
                studentPrivateClass.map((eachClass, index) =>
                (new Date(eachClass.date).getTime() === value.getTime() &&
                    <CalendarClassCard key={index} accountRole='student' eachClass={eachClass} />))
            )} */}
            {/* {studentGroupClass.length > 0 && (
                studentGroupClass.map((eachClass, index) =>
                (new Date(eachClass.date).getTime() === value.getTime() &&
                    <CalendarClassCard key={index} accountRole='student'  eachClass={eachClass} />))
            )} */}
        </>
    )
}


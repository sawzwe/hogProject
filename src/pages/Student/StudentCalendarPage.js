import { Helmet } from 'react-helmet-async';
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// @mui
import { Container, Typography } from '@mui/material';
// components
import axios from 'axios';
import { useSettingsContext } from '../../components/settings';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
// sections
import StudentCalendar from '../../sections/dashboard/student/StudentCalendar'
//
import { currentStudent } from './mockup';
// get student id
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------


export default function StudentCalendarPage() {
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();
    const dataFetchedRef = useRef(false);

    const { user } = useAuthContext();
    const config = { headers: { Authorization: `Bearer ${user.accessToken}` } }

    // Course ID
    const [studentCourse, setStudentCourse] = useState();

    const fetchClass = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Course/Get/${user.id}`, config)
            .then((res) => {
                console.log('res', res);
                const data = res.data.data
                setStudentCourse(data)
                // console.log('data', data)
            })
            .catch((error) => navigate('*', { replace: false }))
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        fetchClass();
        dataFetchedRef.current = true;
    }, [])


    if (studentCourse === undefined) {
        return <LoadingScreen />
    }

    const mappedStudentClasses = [];

    studentCourse.forEach((currentCourse) => {
        const course = {
            id: currentCourse.registeredCourses.id.toString(),
            course: currentCourse.registeredCourses.course,
            subject: currentCourse.registeredCourses.subject,
            level: currentCourse.registeredCourses.level,
            type: currentCourse.registeredCourses.method,
            section: currentCourse.registeredCourses.section,
        }

        const currentClasses = currentCourse.registeredClasses;
        const mappedClasses = currentClasses.map((eachClass, index) => {
            return {
                id: eachClass.id,
                course,
                classNo: index,
                students: [{ id: '1', fullName: 'Piyaphon Wu' }],
                date: eachClass.date,
                fromTime: eachClass.fromTime,
                toTime: eachClass.toTime,
                room: eachClass.room,
                section: course.section,
                teacher: { id: eachClass.teacherPrivateClass.teacherId, fullName: eachClass.teacherPrivateClass.fullName },
                attendance: 'Present'
            };
        });

        mappedStudentClasses.push(...mappedClasses);
    });

    // console.log(mappedStudentClasses);

    return (
        <>
            <Helmet>
                <title> Student Calendar </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h4" gutterBottom>
                    Calendar
                </Typography>
                {/* <StudentCalendar mappedClasses={mappedStudentClasses} /> */}
                <StudentCalendar currentStudent={mappedStudentClasses} />
            </Container>
        </>
    );
}

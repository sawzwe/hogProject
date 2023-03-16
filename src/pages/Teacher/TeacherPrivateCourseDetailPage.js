import { Helmet } from 'react-helmet-async';
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// @mui
import axios from 'axios';
import { Container, Typography, Stack } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import TeacherAllClasses from '../../sections/dashboard/teacher/TeacherAllClasses'
import { currentTeacher } from './mockup';
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function TeacherPrivateCourseDetailPage() {
    // const { themeStretch } = useSettingsContext();
    // const navigate = useNavigate();

    // const { courseId } = useParams();
    // const currentCourse = currentTeacher.teacherPrivateCourse.find(course => course.id === courseId);
    // const classes = currentTeacher.teacherPrivateClass.filter(eachClass => (eachClass.course.id === currentCourse.id));

    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();
    const dataFetchedRef = useRef(false);

    const { user } = useAuthContext();
    const config = { headers: { Authorization: `Bearer ${user.accessToken}` } }

    // Course ID
    const { courseId } = useParams();
    const [teacherCourse, setTeacherCourse] = useState();

    const fetchClass = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Course/Get/${1}`, config)
            .then((res) => {
                console.log('res', res);
                const data = res.data.data
                setTeacherCourse(data)
                // console.log('data', data)
            })
            .catch((error) => navigate('*', { replace: false }))
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        fetchClass();
        dataFetchedRef.current = true;
    }, [])




    if (teacherCourse === undefined) {
        return <LoadingScreen />
    }


    const currentcourse = teacherCourse.find(item => item.registeredCourses.id === parseInt(courseId, 10));
    const course = {
        id: currentcourse.registeredCourses.id.toString(),
        course: currentcourse.registeredCourses.course,
        subject: currentcourse.registeredCourses.subject,
        level: currentcourse.registeredCourses.level,
        type: currentcourse.registeredCourses.method,
        section: currentcourse.registeredCourses.section,
    }



    const currentclasses = currentcourse.registeredClasses;
    // console.log(currentclasses)
    const mappedStudentClass = currentclasses.map((eachClass, index) => {
        // map the attendance records for each student private class
        const mappedAttendanceStudent = eachClass.studentPrivateClasses.map((studentPrivateClass) => {
            // console.log( eachClass.teacherPrivateClass.status)
            return {
                attendance: studentPrivateClass.attendance,
                attendanceStatus : eachClass.teacherPrivateClass.status,    
            };
        });
        // console.log('hi',mappedAttendanceStudent[0].attendance)

        return {
            id: eachClass.id,
            course,
            classNo: (index + 1),
            // students: { id: '2', fullName: 'Michael Bull' },
            date: eachClass.date,
            fromTime: eachClass.fromTime,
            attendanceStatus : mappedAttendanceStudent[0].attendanceStatus,    
            // attendanceStatus : 'Complete',
            toTime: eachClass.toTime,
            room: eachClass.room,
            section: course.section,
            teacher: { id: eachClass.teacherPrivateClass.teacherId, fullName: eachClass.teacherPrivateClass.fullName },
            // studentAttendance: [
            //     { student: { id: '2', firstName: 'Michael', lastName: 'Bull', fullName: 'Michael Bull', nickname: 'Michael' }, value: 'Present' }
            // ]
        };
    });
    // console.log(currentTeacher)
    // console.log(mappedStudentClass)

    return (
        <>
            <Helmet>
                <title> Private Course Detail </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Stack
                    justifyContent="flex-start"
                    alignItems="center"
                    direction="row">
                    <ArrowBackIosNewRoundedIcon sx={{ cursor: 'pointer', mr: 0.5 }} onClick={() => navigate(-1)} />
                    <Typography variant="h6">
                        {`${course.course} ${course.subject} ${course.level} (${course.type.toUpperCase()})`}
                    </Typography>
                </Stack>
                <Typography variant="body2" sx={{ ml: 3.5 }}>
                    {course.section}
                </Typography>
                <TeacherAllClasses classes={mappedStudentClass} />
            </Container>
        </>
    );
}
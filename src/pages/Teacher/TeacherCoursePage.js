import { Helmet } from 'react-helmet-async';
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// @mui
import { Container, Typography } from '@mui/material';
import axios from 'axios';
// components
import { useSettingsContext } from '../../components/settings';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
// sections
import TeacherCourse from '../../sections/dashboard/teacher/TeacherCourse';
import { currentTeacher } from './mockup';
// get student id
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function TeacherCoursePage() {
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();

    const { user } = useAuthContext();
    const config = { headers: { Authorization: `Bearer ${user.accessToken}` } }
    // console.log(user.id)

    // console.log(userId)
    const dataFetchedRef = useRef(false);

    const [teacher, setTeacher] = useState();
    const [teacherCourse, setTeacherCourse] = useState();

    const fetchStudent = async () => {
        // return axios.get(`${process.env.REACT_APP_HOG_API}/api/Teacher/Get/${user.id}`,config)
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Teacher/Get/${user.id}`, config)
            .then((res) => {
                console.log('res', res);
                const data = res.data.data
                setTeacher(data)
                // console.log('data', data)
            })
            .catch((error) => navigate('*', { replace: false }))
    }

    const fetchCourse = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Teacher/Course/Get/${user.id}`, config)
            // return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Course/Get/${user.id}`,config)
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
        fetchCourse();
        // fetchStudent();
        dataFetchedRef.current = true;
    }, [])

    // if (teacherCourse  === undefined || teacher ===undefined ) {
    if (teacherCourse === undefined) {
        return <LoadingScreen />
    }

    // console.log(teacherCourse)

    // // Map the teacher courses
    // const mappedStudentCourse = teacherCourse.map((course, index) => {
    //     // console.log(course)
    //     return {
    //         id: course.course.id.toString(),
    //         course: course.course.course,
    //         subject: course.course.subject,
    //         level: course.course.level,
    //         type: course.request.courseType,
    //         paymentStatus: course.request.paymentStatus,

    //     };
    // });

    // const currentTeachers = {
    //     teacherPrivateCourse: mappedStudentCourse,
    // };



    // // console.log('fetched',currentStudents)
    // // console.log('dummy',currentStudent)
    // console.log('my', currentTeachers)
    // // console.log('mock',currentTeacher)

    // Assuming teacherId is already defined
    const teacherCourses = teacherCourse.filter((course) => {
        // Check if any of the classes in the course have the teacher's ID
        return course.classes.some((classObj) => classObj.teacherPrivateClass.teacherId === user.id);
    });

    // Map the teacher courses
    const mappedTeacherCourses = teacherCourses.map((course, index) => {
        return {
            id: course.course.id.toString(),
            course: course.course.course,
            subject: course.course.subject,
            level: course.course.level,
            type: course.request.courseType,
            paymentStatus: course.request.paymentStatus,
        };
    });

    const currentTeachers = {
        teacherPrivateCourse: mappedTeacherCourses,
    };

    console.log(currentTeachers);


    return (
        <>
            <Helmet>
                <title> Teacher Course </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h4" gutterBottom>
                    Courses
                </Typography>
                <TeacherCourse currentTeacher={currentTeachers} />
            </Container>
        </>
    );
}
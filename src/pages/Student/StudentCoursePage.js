import { Helmet } from 'react-helmet-async';
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// @mui
import { Container, Typography } from '@mui/material';
// routes
import axios from 'axios';
// components
import { useSettingsContext } from '../../components/settings';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
// sections
import StudentCourse from '../../sections/dashboard/student/StudentCourse';
import { currentStudent } from './mockup';
// get student id
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function StudentCoursePage() {
    const navigate = useNavigate();
    const { themeStretch } = useSettingsContext();

    const {user} = useAuthContext();
    const config = { headers: { Authorization: `Bearer ${user.accessToken}`} }

    // console.log(userId)
    const dataFetchedRef = useRef(false);

    const [student, setStudent] = useState();
    const [studentCourse, setStudentCourse] = useState();

    const fetchStudent = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Get/${user.id}`,config)
            .then((res) => {
                console.log('res', res);
                const data = res.data.data
                setStudent(data)
                // console.log('data', data)
            })
            .catch((error) => navigate('*', { replace: false }))
    }

    const fetchCourse = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Course/Get/${user.id}`,config)
        // return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Course/Get/${user.id}`,config)
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
        fetchCourse();
        fetchStudent();
        dataFetchedRef.current = true;
    }, [])

    if (studentCourse  === undefined || student ===undefined ) {
        return <LoadingScreen />
    }
    
    // Map the student courses
    const mappedStudentCourse = studentCourse.map((course, index) => {
        // console.log(course)
        return {
            id: course.registeredCourses.id.toString(),
            course: course.registeredCourses.course, 
            subject: course.registeredCourses.subject,
            level: course.registeredCourses.level,
            type: course.registeredCourses.method,
        };
    });

    const currentStudents = {
        fName: student.fName,
        lName: student.lName,
        studentPrivateCourse: mappedStudentCourse,
    };

    // console.log('fetched',currentStudents)
    // console.log('dummy',currentStudent)
    console.log(currentStudents)
    return (
        <>
            <Helmet>
                <title> Courses </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h4" gutterBottom>
                    Courses
                </Typography>
                <StudentCourse currentStudent={currentStudents} />
            </Container>
        </>
    );
}

import { Helmet } from 'react-helmet-async';
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// @mui
import { Container, Typography, Stack } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import axios from 'axios';
// components
import { useSettingsContext } from '../../components/settings';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
// sections
import StudentAllClasses from '../../sections/dashboard/student/StudentAllClasses'
import { currentStudent } from './mockup';
// get student id
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function StudentPrivateCourseDetailPage() {
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();
    const dataFetchedRef = useRef(false);

    const {user} = useAuthContext();
    const config = { headers: { Authorization: `Bearer ${user.accessToken}`} }

    // Course ID
    const { id } = useParams();
    // const currentCourse = currentStudent.studentPrivateCourse.find(course => course.id === '0');
    // console.log('current',currentCourse)
    // const classes = currentStudent.studentPrivateClass.filter(eachClass => (eachClass.course.id === currentCourse.id));
    // console.log('classes',classes)

    const [studentCourse, setStudentCourse] = useState();

    const fetchClass = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Course/Get/${user.id}`,config)
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




    if (studentCourse  === undefined ) {
        return <LoadingScreen />
    }

    const currentcourse = studentCourse.find(item => item.registeredCourses.id === parseInt(id,10));
    console.log('course',currentcourse)
    const currentclasses = currentcourse.registeredClasses;   
    console.log(currentclasses)
    
    // // Map the student courses
    // const mappedStudentCourse = studentCourse.map((course, index) => {
    //     // console.log(course)
    //     return {
    //         id: course.registeredCourses.id.toString(),
    //         course: course.registeredCourses.course, 
    //         subject: course.registeredCourses.subject,
    //         level: course.registeredCourses.level,
    //         type: course.registeredCourses.method,
    //     };
    // });

    // const currentStudents = {
    //     fName: 'Piyaphon',
    //     lName: 'Wu',
    //     studentPrivateCourse: mappedStudentCourse,
        
    // };
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
                        {`${currentcourse.registeredCourses.course} ${currentcourse.registeredCourses.subject} (${currentcourse.registeredCourses.method.toUpperCase()})`}
                    </Typography>
                </Stack>
                {/* <StudentAllClasses classes={classes} /> */}
            </Container>
        </>
    );
}
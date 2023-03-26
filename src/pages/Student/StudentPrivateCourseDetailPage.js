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

    const { user } = useAuthContext();
    const config = { headers: { Authorization: `Bearer ${user.accessToken}` } }

    // Course ID
    const { id } = useParams();
    // const currentCourse = currentStudent.studentPrivateCourse.find(course => course.id === '0');
    // console.log('current',currentCourse)
    // const classes = currentStudent.studentPrivateClass.filter(eachClass => (eachClass.course.id === currentCourse.id));
    // console.log('classes',classes)

    const [studentCourse, setStudentCourse] = useState();

    const fetchClass = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Course/Get/${user.id}`, config)
            .then((res) => {
                // console.log('res', res);
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


    const currentcourse = studentCourse.find(item => item.registeredCourse.id === parseInt(id, 10));
    // console.log('currentcourse', currentcourse)
    // console.log('currentcourse',currentcourse)
    const course = {
        id: currentcourse.registeredCourse.id.toString(),
        course: currentcourse.registeredCourse.course,
        subject: currentcourse.registeredCourse.subject,
        level: currentcourse.registeredCourse.level,
        type: currentcourse.request.courseType,
        section: currentcourse.registeredCourse.section,
        paymentStatus: currentcourse.request.paymentStatus
    }
    // console.log(currentcourse)
    const currentclasses = currentcourse.registeredClasses;

    const mappedStudentClass = currentclasses.map((eachClass, index) => {
        // map the attendance records for each student private class
        const mappedAttendanceStudent = eachClass.studentPrivateClasses.find(record => record.studentId === user.id)
        // console.log(eachClass.request.paymentStatus)
        return {
            id: eachClass.id,
            course,
            classNo: (index + 1),
            //   students: {id: '2', fullName: 'Hong'},
            date: eachClass.date,
            fromTime: eachClass.fromTime,
            toTime: eachClass.toTime,
            room: eachClass.room,
            section: course.section,
            teacher: { id: eachClass.teacherPrivateClass.teacherId, fullName: eachClass.teacherPrivateClass.fullName },
            attendance: mappedAttendanceStudent?.attendance || '',
            paymentStatus: course.paymentStatus
        };
    });



    // console.log('mapped',mappedStudentClass)
    // console.log('course',course.course)

    // classes = {[
    //     {
    //         id: '0',
    //         course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
    //         classNo: '1',
    //         students: [{ id: '1', fullName: 'Piyaphon Wu' }],
    //         date: '13-Mar-2023',
    //         fromTime: '10:00',
    //         toTime: '12:00',
    //         room: '306',
    //         section: 'Piyaphon Wu',
    //         teacher: { id: '1', fullName: 'Kiratijuta Bhumichitr' },
    //         attendance: 'Present'
    //     },
    //     {
    //         id: '1',
    //         course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
    //         classNo: '2',
    //         students: [{ id: '1', fullName: 'Piyaphon Wu' }],
    //         date: '15-Mar-2023',
    //         fromTime: '10:00',
    //         toTime: '12:00',
    //         room: '306',
    //         section: 'Piyaphon Wu',
    //         teacher: { id: '1', fullName: 'Kiratijuta Bhumichitr' },
    //         attendance: 'Present'
    //     },
    //     {
    //         id: '2',
    //         course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
    //         classNo: '3',
    //         students: [{ id: '1', fullName: 'Piyaphon Wu' }],
    //         date: '17-Mar-2023',
    //         fromTime: '10:00',
    //         toTime: '12:00',
    //         room: '306',
    //         section: 'Piyaphon Wu',
    //         teacher: { id: '1', fullName: 'Kiratijuta Bhumichitr' },
    //         attendance: 'None'
    //     },
    //     {
    //         id: '3',
    //         course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
    //         classNo: '4',
    //         students: [{ id: '1', fullName: 'Piyaphon Wu' }],
    //         date: '19-Mar-2023',
    //         fromTime: '10:00',
    //         toTime: '12:00',
    //         room: '306',
    //         section: 'Piyaphon Wu',
    //         teacher: { id: '1', fullName: 'Kiratijuta Bhumichitr' },
    //         attendance: 'None'
    //     },
    //     {
    //         id: '4',
    //         course: { id: '1', course: 'GED', subject: 'MATH', level: 'REGULAR', type: 'Semi Private' },
    //         classNo: '1',
    //         students: [{ id: '0', fullName: 'Michael Bull'}, { id: '1', fullName: 'Piyaphon Wu' }],
    //         date: '14-Mar-2023',
    //         fromTime: '13:00',
    //         toTime: '15:00',
    //         room: '306',
    //         section: 'Kaphao Mookrob Group',
    //         teacher: { id: '2', fullName: 'Nirawit Janturong' },
    //         attendance: 'None'
    //     },
    //     {
    //         id: '5',
    //         course: { id: '1', course: 'GED', subject: 'MATH', level: 'REGULAR', type: 'Semi Private' },
    //         classNo: '2',
    //         students: [{ id: '0', fullName: 'Michael Bull'}, { id: '1', fullName: 'Piyaphon Wu' }],
    //         date: '16-Mar-2023',
    //         fromTime: '13:00',
    //         toTime: '15:00',
    //         room: '306',
    //         section: 'Kaphao Mookrob Group',
    //         teacher: { id: '2', fullName: 'Nirawit Janturong' },
    //         attendance: 'None'
    //     }
    // ],}
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
                <StudentAllClasses classes={mappedStudentClass} />
            </Container>

        </>
    );
}
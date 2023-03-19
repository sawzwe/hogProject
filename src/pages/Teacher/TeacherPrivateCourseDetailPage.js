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
import TeacherCheckPrivateAttendance from './TeacherCheckPrivateAttendancePage';
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
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Teacher/Course/Get/${user.id}`, config)
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


    const currentcourse = teacherCourse.find(item => item.course.id === parseInt(courseId, 10));
    const course = {
        id: currentcourse.course.id.toString(),
        course: currentcourse.course.course,
        subject: currentcourse.course.subject,
        level: currentcourse.course.level,
        type: currentcourse.request.courseType,
        section: currentcourse.course.section,
    }



    const currentclasses = currentcourse.classes;
    // console.log(currentclasses)

    const mappedStudentClass = currentclasses.map((eachClass, index) => {
        // map the attendance records for each student private class
        const mappedAttendanceStudent = eachClass.studentPrivateClasses.map((studentPrivateClass) => {
          return {
            student: { 
              id: studentPrivateClass.studentId,  
              fullName: studentPrivateClass.fullName, 
              nickname: studentPrivateClass.nickname
            }, 
            value: studentPrivateClass.attendance
          };
        });
      
        return {
          id: eachClass.id,
          course,
          classNo: (index + 1),
          date: eachClass.date,
          fromTime: eachClass.fromTime,
          attendanceStatus: eachClass.teacherPrivateClass.status, // include attendance status for this class
          toTime: eachClass.toTime,
          room: eachClass.room,
          section: course.section,
          teacher: { 
            id: eachClass.teacherPrivateClass.teacherId, 
            fullName: eachClass.teacherPrivateClass.fullName 
          },
          studentAttendance: mappedAttendanceStudent.map((attendance) => { // map attendance records for each student in this class
            return {
              student: attendance.student,
              value: attendance.value
            };
          })
        };
      });
      
    // console.log(currentTeacher)
    // console.log(mappedStudentClass)
    const filteredClasses = mappedStudentClass.filter((eachClass) => eachClass.teacher.id === user.id);
    // console.log(filteredClasses)


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
                <TeacherAllClasses classes={filteredClasses} />
            </Container>
        </>
    );
}
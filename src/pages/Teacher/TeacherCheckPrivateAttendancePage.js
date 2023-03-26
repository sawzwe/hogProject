import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import axios from 'axios';
import { Container, Typography, Stack } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
// components
import { useSettingsContext } from '../../components/settings';
import { DiscardDialog } from '../../components/discard-dialog/DiscardDialog';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
// sections
import TeacherCheckAttendance from '../../sections/dashboard/teacher/TeacherCheckAttendance';
import { currentTeacher } from './mockup';
// utils
import { fDate } from '../../utils/formatTime';
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------
TeacherCheckPrivateAttendance.propTypes = {
    classes: PropTypes.array,
};
export default function TeacherCheckPrivateAttendance({ classes }) {
    // console.log(classes);
    const { user } = useAuthContext();
    const config = { headers: { Authorization: `Bearer ${user.accessToken}` } }
    const dataFetchedRef = useRef(false);
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();
    const { classId } = useParams();
    const [teacherCourse, setTeacherCourse] = useState();
    const [openDiscardDialog, setOpenDiscardDialog] = useState(false);

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
    // console.log(teacherCourse)
    const mappedStudentClasses = [];
    
    teacherCourse.forEach((currentCourse) => {
        const course = {
            id: currentCourse.course.id.toString(),
            course: currentCourse.course.course,
            subject: currentCourse.course.subject,
            level: currentCourse.course.level,
            type: currentCourse.request.courseType,
            section: currentCourse.course.section,
            paymentStatus: currentCourse.request.paymentStatus
        }

        const currentClasses = currentCourse.classes;
        const mappedClass = currentClasses.map((eachClass, index) => {
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
            
            const students = eachClass.studentPrivateClasses.map((studentPrivateClass) => {
                return {
                    apiId: studentPrivateClass.id,
                    id: studentPrivateClass.studentId,  
                    fullName: studentPrivateClass.fullName, 
                    nickname: studentPrivateClass.nickname
                };
              });
          
            return {
              id: eachClass.id,
              course,
              classNo: (index + 1),
              students,
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

        mappedStudentClasses.push(...mappedClass);
    });
    // console.log(mappedStudentClasses)

    const current = currentTeacher.teacherPrivateClass.find(eachClass => (eachClass.id === '0'));
    const currentClass= mappedStudentClasses.find(eachClass => eachClass.id === parseInt(classId,10));
    // console.log("mock",current);
    // console.log("api",currentClass);

    // Discard Dialog
    

    const handleDiscard = () => {
        navigate(-1);
    };
    // const today = new Date();
    // today.setHours(0, 0, 0, 0)
    // const assumeCurrentDate = fDate(today, 'dd MMMM yyyy');

    const assumeCurrentDate = fDate(new Date("2023-03-23"), 'dd MMMM yyyy');

    // console.log(assumeCurrentDate)
    const classDate = fDate(new Date(currentClass.date), 'dd MMMM yyyy');

    const handleGoBack = () => {
        if (assumeCurrentDate === classDate) {
            setOpenDiscardDialog(true);
        } else {
            navigate(-1);
        }
    }
    // console.log(assumeCurrentDate === classDate);
    return (
        <>
            <Helmet>
                <title> Check Attendance </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Stack
                    justifyContent="flex-start"
                    alignItems="center"
                    direction="row">
                    <ArrowBackIosNewRoundedIcon sx={{ cursor: 'pointer', mr: 0.5 }} onClick={handleGoBack} />
                    <Typography variant="h6">
                        {`${currentClass.course.course} ${currentClass.course.subject} (${currentClass.course.type.toUpperCase()})`}
                    </Typography>
                </Stack>
                <Typography variant="body2" sx={{ ml: 3.5 }}>
                    {currentClass.section}
                </Typography>
                <TeacherCheckAttendance currentClass={currentClass} isEdit={assumeCurrentDate === classDate} />
            </Container>

            <DiscardDialog
                open={openDiscardDialog}
                onClose={() => setOpenDiscardDialog(false)}
                title="Discard Change?"
                content="If you discard, your change will not be saved to the system"
                onDiscard={handleDiscard}
            />
        </>
    );
}
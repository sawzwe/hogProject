import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// firebase
import { getStorage, ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
// @mui
import { Container, Button, Stack, Card } from '@mui/material';
// auth
import { useAuthContext } from '../auth/useAuthContext';
// routes
import { PATH_ACCOUNT } from '../routes/paths';
// components
import LoadingScreen from '../components/loading-screen/LoadingScreen';
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import NotFound from '../components/NotFound';
// sections
import ViewEditTeacherCourse from '../sections/dashboard/ViewEditTeacherCourse';
// import { studentList } from '../sections/dashboard/ep-registration-request-form/_mockupData';

// ----------------------------------------------------------------------

export default function ViewEditTeacherCoursePage() {
    const { themeStretch } = useSettingsContext();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { id } = useParams();

    const config = { headers: { Authorization: `Bearer ${user.accessToken}` } }

    const dataFetchedRef = useRef(false);

    const [teacher, setTeacher] = useState();
    const [courses, setCourses] = useState();
    const [pendingCourses, setPendingCourses] = useState();

    const fetchTeacher = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Teacher/Get/${id}`, config)
            .then((res) => {
                const data = res.data.data
                setTeacher(data)
            })
            .catch((error) => setTeacher('Not Found'))
    }


    const fetchCourses = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Teacher/Course/Get/${id}`, config)
            .then((res) => {
                const data = res.data.data
                const completePaymentCourses = data.filter((course) => course.request.paymentStatus === 'Complete');
                const pendingCourses = data.filter((course) => course.request.paymentStatus === 'Pending');
                setPendingCourses(pendingCourses);
                setCourses(completePaymentCourses);
            })
            .catch((error) => navigate('*', { replace: false }))
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchTeacher();
        fetchCourses();
    }, [])

    if (teacher === undefined || courses === undefined) {
        return <LoadingScreen />
    }

    if (teacher === 'Not Found') {
        return (
            <>
                <Helmet>
                    <title> Course Detail </title>
                </Helmet>

                <Container maxWidth={themeStretch ? false : 'lg'}>
                    <CustomBreadcrumbs
                        heading="Teacher Course"
                        links={[
                            {
                                name: 'All Teachers',
                                href: PATH_ACCOUNT.teacherManagement.searchCourseTeacher,
                            },
                            { name: "Not found" },
                        ]}
                    />
                    <NotFound
                        title='Sorry, teacher not found!'
                        message='Sorry, we couldn’t find the teacher you’re looking for.'
                        action='Go Back'
                    />
                </Container>

            </>
        )
    }

    // console.log(teacher)
    // console.log(courses)
    // console.log(pendingCourses)

    return (
        <>
            <Helmet>
                <title> Course Detail </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>

                <CustomBreadcrumbs
                    heading="Teacher Course"
                    links={[
                        {
                            name: 'All Teachers',
                            href: PATH_ACCOUNT.teacherManagement.searchCourseTeacher,
                        },
                        { name: `${teacher.fullName}` },
                    ]}
                />
                <Stack spacing={3}>

                    <ViewEditTeacherCourse currentTeacher={teacher} currentCourses={courses} pendingCourses={pendingCourses} />

                </Stack>
            </Container>
        </>
    );
}

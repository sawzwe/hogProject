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
import ViewEditStudentCourse from '../sections/dashboard/ViewEditStudentCourse';
import { studentList } from '../sections/dashboard/ep-registration-request-form/_mockupData';

// ----------------------------------------------------------------------

export default function ViewEditStudentCoursePage() {
    const { themeStretch } = useSettingsContext();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { id } = useParams();

    const config = { headers: { Authorization: `Bearer ${user.accessToken}` } }

    const dataFetchedRef = useRef(false);

    const [student, setStudent] = useState();
    const [courses, setCourses] = useState();
    const [pendingCourses, setPendingCourses] = useState();

    const fetchStudent = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Get/${id}`, config)
            .then((res) => {
                const data = res.data.data
                setStudent(data)
            })
            .catch((error) => setStudent('Not Found'))
    }


    const fetchCourses = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Course/Get/${id}`, config)
            .then((res) => {
                const data = res.data.data
                const enabledCourses = data.filter((course) => course.registeredCourse.isActive === true);
                const completePaymentCourses = enabledCourses.filter((course) => course.request.paymentStatus === 'Complete');
                const pendingCourses = enabledCourses.filter((course) => course.request.paymentStatus === 'Pending');
                setPendingCourses(pendingCourses)
                setCourses(completePaymentCourses)
            })
            .catch((error) => navigate('*', { replace: false }))
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchStudent();
        fetchCourses();
    }, [])

    if (student === undefined || courses === undefined) {
        return <LoadingScreen />
    }

    if (student === 'Not Found') {
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
                                name: 'All Students',
                                href: PATH_ACCOUNT.studentManagement.searchCourseStudent,
                            },
                            { name: "Not found" },
                        ]}
                    />
                    <NotFound
                        title='Sorry, student not found!'
                        message='Sorry, we couldn’t find the student you’re looking for.'
                        action='Go Back'
                    />
                </Container>

            </>
        )
    }


    return (
        <>
            <Helmet>
                <title> Course Detail </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>

                <CustomBreadcrumbs
                    heading="Student Course"
                    links={[
                        {
                            name: 'All Students',
                            href: PATH_ACCOUNT.studentManagement.searchCourseStudent,
                        },
                        { name: `${student.fullName}` },
                    ]}
                />
                <Stack spacing={3}>

                    <ViewEditStudentCourse currentStudent={student} currentCourses={courses} pendingCourses={pendingCourses} />

                </Stack>
            </Container>
        </>
    );
}

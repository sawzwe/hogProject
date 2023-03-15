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
// sections
import ViewEditStudentCourse from '../sections/dashboard/ViewEditStudentCourse';
import { studentList } from '../sections/dashboard/ep-registration-request-form/_mockupData';

// ----------------------------------------------------------------------

export default function ViewStudentPage() {
    const { themeStretch } = useSettingsContext();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { id } = useParams();

    const config = { headers: { Authorization: `Bearer ${user.accessToken}` } }

    const dataFetchedRef = useRef(false);

    const [student, setStudent] = useState();
    const [courses, setCourses] = useState();

    const fetchStudent = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Get/${id}`, config)
            .then((res) => {
                const data = res.data.data
                setStudent(data)
            })
            .catch((error) => navigate('*', { replace: false }))
    }


    const fetchCourses = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Course/Get/${id}`, config)
            .then((res) => {
                const data = res.data.data
                setCourses(data)
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
                            name: 'All students',
                            href: PATH_ACCOUNT.studentManagement.searchCourseStudent,
                        },
                        { name: `${student.fullName}` },
                    ]}
                />
                <Stack spacing={3}>

                    <ViewEditStudentCourse currentStudent={student} currentCourses={courses} />

                </Stack>
            </Container>
        </>
    );
}

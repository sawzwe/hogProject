import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
// firebase
import { getStorage, ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
// @mui
import { Container, Button, Stack, Card } from '@mui/material';
// axios
import axios from 'axios';
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
    const navigate = useNavigate();
    const { id } = useParams();


    const dataFetchedRef = useRef(false);

    const [student, setStudent] = useState();


    const fetchData = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Get/${id}`)
            .then((res) => {
                console.log('res', res);
                const data = res.data.data.fullName
                setStudent(data)
                // console.log('data', data)
            })
            .catch((error) => navigate('*', { replace: false }))
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        fetchData();
        dataFetchedRef.current = true;
    }, [])

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
                        { name: `${student}` },
                    ]}
                />
                <Stack spacing={3}>
                    <Card sx={{ p: 3 }}>
                        <ViewEditStudentCourse />
                    </Card>
                </Stack>
            </Container>
        </>
    );
}

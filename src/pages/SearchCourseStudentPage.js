import { Helmet } from 'react-helmet-async';
import { useState, useEffect,useRef } from 'react';
import axios from 'axios';
// @mui
import { Card, Container, Stack } from '@mui/material';
// auth
import { useAuthContext } from '../auth/useAuthContext';
// components
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import LoadingScreen from '../components/loading-screen/LoadingScreen';
// routes
import { PATH_ACCOUNT } from '../routes/paths';
// Table
import {StudentCourseList} from '../sections/dashboard/all-students-list';
// API
import { HOG_API } from '../config';

// ----------------------------------------------------------------------

export default function SearchCourseStudentPage() {
    const { themeStretch } = useSettingsContext();
    const { user } = useAuthContext()

    const config = { headers: { Authorization: `Bearer ${user.accessToken}`} }

    const dataFetchedRef = useRef(false);
    const [studentCourseData, setStudentCourseData] = useState();

    const fetchData = async () => {
        return axios.get(`${HOG_API}/api/Student/CourseCount/Get`, config)
            .then(response => {
                // console.log(response.data.data)
                setStudentCourseData(response.data.data);
                // console.log("API table" ,response.data.data);
            })
            .catch(error => {
                console.error(error);
            });
    }




    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchData();

    }, [])

    if (studentCourseData === undefined) {
        return <LoadingScreen />;
    }


    return (
        <>
            <Helmet>
                <title>Student Course List</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="All Students Courses"
                    links={[
                        {
                            name: 'All Students',
                            href: PATH_ACCOUNT.studentManagement.searchCourseStudent
                        }
                    ]}
                />
                <Stack spacing={3}>
                    <Card>
                        <StudentCourseList studentCourseData={studentCourseData}/>
                    </Card>
                </Stack>
            </Container>
        </>
    );
}

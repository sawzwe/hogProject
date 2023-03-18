import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
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
import { TeacherCourseList } from '../sections/dashboard/all-students-list';
import { HOG_API } from '../config';

// ----------------------------------------------------------------------

export default function SearchTeacherCoursePage() {
    const { themeStretch } = useSettingsContext();
    const { user } = useAuthContext()

    const config = { headers: { Authorization: `Bearer ${user.accessToken}` } }

    const dataFetchedRef = useRef(false);
    const [teacherCourseData, setTeacherCourseData] = useState();

    const fetchData = async () => {
        return axios.get(`${HOG_API}/api/Student/CourseCount/Get`, config)
            .then(response => {
                // console.log(response.data.data)
                setTeacherCourseData(response.data.data);
                // console.log("API table" ,response.data.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchData();

    }, [])

    if (teacherCourseData === undefined) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Helmet>
                <title>Teacher Course List</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="All Teachers Courses"
                    links={[
                        {
                            name: 'All Teachers',
                            href: PATH_ACCOUNT.teacherManagement.searchCourseTeacher,
                        },
                    ]}
                />
                <Stack spacing={3}>
                    <Card>
                        <TeacherCourseList teacherCourseData={teacherCourseData} />
                    </Card>
                </Stack>
            </Container>
        </>
    );
}

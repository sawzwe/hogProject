import { Helmet } from 'react-helmet-async';
import { useState,useEffect,useRef } from 'react';
// @mui
import { Card, Container, Stack } from '@mui/material';
// components
import axios from 'axios';
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import LoadingScreen from '../components/loading-screen/LoadingScreen';

// routes
import { PATH_ACCOUNT } from '../routes/paths';
// Table
import {TeacherCourseList} from '../sections/dashboard/all-students-list';
import { HOG_API } from '../config';

// ----------------------------------------------------------------------

export default function SearchTeacherCoursePage() {
    const { themeStretch } = useSettingsContext();

    const dataFetchedRef = useRef(false);
    const [privateScheduleRequest, setPrivateScheduleRequest] = useState();

    const fetchData = async () => {
        return axios.get(`${HOG_API}/api/PrivateRegistrationRequest/Schedule/Get`)
            .then(response => {
                // console.log(response.data.data)
                setPrivateScheduleRequest(response.data.data);
                // console.log("API table" ,response.data.data);
                // console.log("Type", typeof(response.data.data))
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

    if (privateScheduleRequest === undefined) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Helmet>
                <title>Teacher Course List Table</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="All Teachers"
                    links={[
                        {
                            name: 'All Teachers',
                            href: PATH_ACCOUNT.teacherManagement.searchCourseTeacher,
                        },  
                    ]}
                />
                <Stack spacing={3}>
                    <Card>
                        <TeacherCourseList privateScheduleRequest={privateScheduleRequest}/>
                    </Card>
                </Stack>
            </Container>
        </>
    );
}

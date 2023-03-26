import { Helmet } from 'react-helmet-async';
import { useState, useEffect,useRef } from 'react';
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
import {TeacherList} from '../sections/dashboard/all-students-list';
// API
import { HOG_API } from '../config';

// ----------------------------------------------------------------------

export default function SearchTeacherPage() {
    const { themeStretch } = useSettingsContext();

    const dataFetchedRef = useRef(false);
    const [teacherTableData, setTeacherTableData] = useState();

    const fetchData = async () => {
        return axios.get(`${HOG_API}/api/Teacher/Get`)
            .then(response => {
                // console.log(response.data.data)
                setTeacherTableData(response.data.data);
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

    if (teacherTableData === undefined) {
        return <LoadingScreen />;
    }


    return (
        <>
            <Helmet>
                <title>All Teachers</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="All Teachers"
                    links={[
                        {
                            name: 'All Teachers',
                            href: PATH_ACCOUNT.teacherManagement.searchTeacher,
                        },
                    ]}
                />
                <Stack spacing={3}>
                    <Card>
                        <TeacherList teacherTableData={teacherTableData} />
                    </Card>
                </Stack>
            </Container>
        </>
    );
}

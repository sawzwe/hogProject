import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_REGISTRATION } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import NewRegistrationRequest from '../../sections/dashboard/ep-registration-request-form/NewRegistrationRequest';
//
import { HOG_API } from '../../config';

// ----------------------------------------------------------------------

export default function CreateRegistrationRequestPage() {
    const { themeStretch } = useSettingsContext();

    const dataFetchedRef = useRef(false);

    const [studentList, setStudentList] = useState([]);

    const fetchStudent = async() => {
        axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Get`)
        .then((res) => setStudentList(res.data.data))
        .catch((error) => console.error(error))
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchStudent();
    }, [])

    return (
        <>
            <Helmet>
                <title> EP | Create Registration Request </title>
            </Helmet>


            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Create registration request"
                    links={[
                        {
                            name: 'Create Request',
                            href: PATH_REGISTRATION.createRequest,
                        },
                    ]}
                />

                <NewRegistrationRequest studentList={studentList} />
            </Container>
        </>
    );
}

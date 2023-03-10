import { Helmet } from 'react-helmet-async';
import { useState, useEffect,useRef } from 'react';
// @mui
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import { PATH_REGISTRATION } from '../../routes/paths';
// components
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import RegistrationRequestStatusList from '../../sections/dashboard/ea-request-management-list/RegistrationRequestStatusList'
import { HOG_API } from '../../config';


// ----------------------------------------------------------------------

export default function RegistrationRequestPage() {
    const { themeStretch } = useSettingsContext();

    const dataFetchedRef = useRef(false);
    const [privateRegistrationRequest, setPrivateRegistrationRequest] = useState();

    const fetchData = async () => {
        return axios.get(`${HOG_API}/api/PrivateRegistrationRequest/Request/Get`)
            .then(response => {
                // console.log(response.data.data)
                setPrivateRegistrationRequest(response.data.data);
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

    if (privateRegistrationRequest === undefined) {
        return <LoadingScreen />;
    }
    return (
        <>
            <Helmet>
                <title> EA | Registration Request</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Course Registration Requests"
                    links={[
                        {
                            name: 'All requests',
                        },
                    ]}
                />
                <RegistrationRequestStatusList privateRegistrationRequest={privateRegistrationRequest} />
            </Container>
        </>
    );
}

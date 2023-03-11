import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// @mui
import { Container } from '@mui/material';
import { PATH_REGISTRATION } from '../../routes/paths';
// components
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import RegistrationRequestStatusList from '../../sections/dashboard/ep-course-registration-request-list/RegistrationRequestStatusList'
//
import { HOG_API } from '../../config';

// ----------------------------------------------------------------------

export default function RegistrationRequestStatusPage() {
    const { themeStretch } = useSettingsContext();
    const [registrationRequests, setRegistrationRequests] = useState();
    const dataFetchedRef = useRef(false);

    const fetchRequests = async () => {
        try {
            await axios.get(`${HOG_API}/api/PrivateRegistrationRequest/Get`)
                .then((res) => {
                    setRegistrationRequests(res.data.data)
                })
                .catch((error) => {
                    throw error;
                })
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchRequests();
    }, [])

    if (registrationRequests === undefined) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Helmet>
                <title> EP | Request Status </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Course Registration"
                    links={[
                        {
                            name: 'All Requests',
                            href: PATH_REGISTRATION.epRequestStatus,
                        },

                    ]}
                />
                <RegistrationRequestStatusList registrationRequests={registrationRequests} />
            </Container>
        </>
    );
}

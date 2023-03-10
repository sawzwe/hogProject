import { Helmet } from 'react-helmet-async';
import {useState, useEffect, useRef} from 'react';
// @mui
import axios from 'axios';
import { Container } from '@mui/material';
import { PATH_REGISTRATION } from '../../routes/paths';
// components
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import RegistrationRequestStatusList from '../../sections/dashboard/oa-registration-request-list/RegistrationRequestStatusList'
import { HOG_API } from '../../config';


// ----------------------------------------------------------------------

export default function RegistrationRequestStatusPage() {
    const { themeStretch } = useSettingsContext();
    const [registrationRequests, setRegistrationRequests] = useState();
    const dataFetchedRef = useRef(false);

    const fetchRequests = async () => {
        try {
            await axios.get(`${HOG_API}/api/PrivateRegistrationRequest/Request/Get`)
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
    // console.log("data",registrationRequests)
    return (
        <>
            <Helmet>
                <title> OA | Registration Request </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Course Registration Request Status"
                    links={[
                        {
                            name: 'Course Registration',
                            href: PATH_REGISTRATION.oaRequestStatus,
                        },
                        { name: 'Request status' },
                    ]}
                />
                <RegistrationRequestStatusList registrationRequests={registrationRequests}/>
            </Container>
        </>
    );
}

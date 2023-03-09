import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
import { PATH_REGISTRATION } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import RegistrationRequestStatusList from '../../sections/dashboard/ea-request-management-list/RegistrationRequestStatusList'

// ----------------------------------------------------------------------

export default function RegistrationRequestPage() {
    const { themeStretch } = useSettingsContext();

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
                <RegistrationRequestStatusList />
            </Container>
        </>
    );
}

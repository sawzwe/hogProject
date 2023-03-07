import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
import { PATH_REGISTRATION } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import RegistrationRequestStatusList from '../../sections/dashboard/ep-course-registration-request-list/RegistrationRequestStatusList'

// ----------------------------------------------------------------------

export default function RegistrationRequestStatusPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> EP | Request Status </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="All Requests"
                    links={[
                        {
                            name: 'Course Registration',
                            href: PATH_REGISTRATION.epRequestStatus,
                        },
                        { name: 'Request status' },
                    ]}
                />
                <RegistrationRequestStatusList />
            </Container>
        </>
    );
}

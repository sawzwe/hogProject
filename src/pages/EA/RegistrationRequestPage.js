import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import StaffRequestStatusList from '../../sections/dashboard/ea-course-registration-request-list/RegistrationRequestStatusList'

// ----------------------------------------------------------------------

export default function RegistrationRequestPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> EA | Registration Request</title>
            </Helmet>
            <CustomBreadcrumbs
                heading="Course Registration Request Status"
                links={[
                    {
                        name: 'Course Registration',
                        href: PATH_DASHBOARD.courseRegistration.root,
                    },
                    { name: 'Request status' },
                ]}
            />
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <StaffRequestStatusList />
            </Container>
        </>
    );
}

import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
import { PATH_REGISTRATION } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import RegistrationRequestStatusList from '../../sections/dashboard/oa-registration-request-list/RegistrationRequestStatusList'

// ----------------------------------------------------------------------

export default function RegistrationRequestStatusPage() {
    const { themeStretch } = useSettingsContext();

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
                <RegistrationRequestStatusList />
            </Container>
        </>
    );
}

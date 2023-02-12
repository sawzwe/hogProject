import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import LeavingRequestStatusList from '../../sections/dashboard/oa-leaving-request-list/LeavingRequestStatusList'

// ----------------------------------------------------------------------

export default function RegistrationRequestStatusPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> OA | Leaving Request </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Leaving Request List"
                    links={[
                        {
                            name: 'Leaving Request',
                            href: PATH_DASHBOARD.courseRegistration.root,
                        },
                        { name: 'Request status' },
                    ]}
                />
                <LeavingRequestStatusList />
            </Container>
        </>
    );
}

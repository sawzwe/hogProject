import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Typography } from '@mui/material';
import { PATH_SCHEDULE_CHANGING } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import StaffRequestStatusList from '../../sections/dashboard/ea-request-management-list/StaffRequestStatusList'

// ----------------------------------------------------------------------

export default function StaffRequestPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> EA | Staff Request</title>
            </Helmet>
            <CustomBreadcrumbs
                heading="Staff Request Status"
                links={[
                    {
                        name: 'Staff Requests',
                        href: PATH_SCHEDULE_CHANGING.staffRequest,
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

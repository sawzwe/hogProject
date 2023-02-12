import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import StudentRequestStatusList from '../../sections/dashboard/ea-request-management-list/StudentRequestStatusList'

// ----------------------------------------------------------------------

export default function StaffRequestPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> EA | Student Request</title>
            </Helmet>
            <CustomBreadcrumbs
                heading="Student Request Status"
                links={[
                    {
                        name: 'Course Registration',
                        href: PATH_DASHBOARD.courseRegistration.root,
                    },
                    { name: 'Request status' },
                ]}
            />
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <StudentRequestStatusList />
            </Container>
        </>
    );
}

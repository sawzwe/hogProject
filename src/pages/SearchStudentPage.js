import { Helmet } from 'react-helmet-async';
// @mui
import { Typography, Box, Card, Container, CardHeader, Stack } from '@mui/material';
// components
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// Table
import SortingSelecting from '../sections/dashboard/ep-all-students-list';

// ----------------------------------------------------------------------

export default function SearchStudentPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> All Student Table</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="All Students"
                    links={[
                        {
                            name: 'Student management',
                            href: PATH_DASHBOARD.studentManagement.root,
                        },
                        { name: 'Search student' },
                    ]}
                />
                <Stack spacing={3}>
                    <Card>
                        <SortingSelecting />
                    </Card>
                </Stack>
            </Container>
        </>
    );
}

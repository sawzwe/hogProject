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

export default function SearchTeacherCoursePage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> All Teacher Table</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="All Teachers Courses"
                    links={[
                        {
                            name: 'Teacher management',
                            href: PATH_DASHBOARD.studentManagement.root,
                        },
                        { name: 'Search teacher course' },
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

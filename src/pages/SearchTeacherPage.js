import { Helmet } from 'react-helmet-async';
// @mui
import { Typography, Box, Card, Container, CardHeader, Stack } from '@mui/material';
// components
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// Table
import SortingSelecting from '../sections/dashboard/all-students-list';

// ----------------------------------------------------------------------

export default function SearchTeacherPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> All Teacher Table</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="All Teachers"
                    links={[
                        {
                            name: 'Teacher management',
                            href: PATH_DASHBOARD.teacherManagement.root,
                        },
                        { name: 'Search teacher' },
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

import { Helmet } from 'react-helmet-async';
// @mui
import { Card, Container, Stack } from '@mui/material';
// components
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// Table
import {StudentCourseList} from '../sections/dashboard/all-students-list';

// ----------------------------------------------------------------------

export default function SearchCourseStudentPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title>Student Course List Table</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="All Students Courses"
                    links={[
                        {
                            name: 'Student management',
                            href: PATH_DASHBOARD.studentManagement.root,
                        },
                        { name: 'Search student course' },
                    ]}
                />
                <Stack spacing={3}>
                    <Card>
                        <StudentCourseList />
                    </Card>
                </Stack>
            </Container>
        </>
    );
}

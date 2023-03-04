import { Helmet } from 'react-helmet-async';
// @mui
import { Card, Container, Stack } from '@mui/material';
// components
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
// routes
import { PATH_ACCOUNT } from '../routes/paths';
// Table
import {TeacherCourseList} from '../sections/dashboard/all-students-list';

// ----------------------------------------------------------------------

export default function SearchTeacherCoursePage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title>Teacher Course List Table</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="All Teachers Courses"
                    links={[
                        {
                            name: 'Teacher management',
                            href: PATH_ACCOUNT.teacherManagement.searchCourseTeacher,
                        },
                        { name: 'Search teacher course' },
                    ]}
                />
                <Stack spacing={3}>
                    <Card>
                        <TeacherCourseList />
                    </Card>
                </Stack>
            </Container>
        </>
    );
}

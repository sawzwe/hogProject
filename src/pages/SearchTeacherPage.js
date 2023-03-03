import { Helmet } from 'react-helmet-async';
// @mui
import { Card, Container, Stack } from '@mui/material';
// components
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
// routes
import { PATH_ACCOUNT } from '../routes/paths';
// Table
import {TeacherList} from '../sections/dashboard/all-students-list';

// ----------------------------------------------------------------------

export default function SearchTeacherPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title>Teacher List Table</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="All Teachers List"
                    links={[
                        {
                            name: 'Teacher management',
                            href: PATH_ACCOUNT.teacherManagement.searchTeacher,
                        },
                        { name: 'Search teacher' },
                    ]}
                />
                <Stack spacing={3}>
                    <Card>
                        <TeacherList />
                    </Card>
                </Stack>
            </Container>
        </>
    );
}

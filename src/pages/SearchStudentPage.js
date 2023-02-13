import { Helmet } from 'react-helmet-async';
// @mui
import { Card, Container, Stack } from '@mui/material';
// components
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// Table
import {StudentList} from '../sections/dashboard/all-students-list';


// ----------------------------------------------------------------------

export default function SearchStudentPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title>Student List Table</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="All Students List"
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
                        <StudentList />
                    </Card>
                </Stack>
            </Container>
        </>
    );
}

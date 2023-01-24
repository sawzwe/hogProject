import { Helmet } from 'react-helmet-async';
// @mui
import { Typography, Box, Card, Container, CardHeader, Stack } from '@mui/material';
// components
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// Table
import SortingSelecting from './EP/TableAllStudents';

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
                    heading="All Teacher Table"
                    links={[
                        {
                            name: 'Teacher Management',
                            href: PATH_DASHBOARD.firstPage,
                        },
                        { name: 'All Teacher TableList' },
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

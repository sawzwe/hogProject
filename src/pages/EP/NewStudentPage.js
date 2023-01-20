import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import StudentNewEditForm from '../../sections/dashboard/StudentNewEditForm';

// ----------------------------------------------------------------------

export default function NewStudentPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> EP | New student </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Create a new student"
                    links={[
                        {
                            name: 'Student management',
                        },
                        { name: 'New student' },
                    ]}
                />
                <StudentNewEditForm />
            </Container>
        </>
    );
}

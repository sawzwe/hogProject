import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// routers
import { Link } from 'react-router-dom';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export default function AllStudentsPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> EP STUDENTS </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="All students"
                    links={[
                        {
                            name: 'All students',
                        },
                    ]}
                />

                <Typography variant="p" component="p" paragraph>
                    <Link to="student/1/edit">Dummy Student</Link>
                </Typography>
            </Container>
        </>
    );
}

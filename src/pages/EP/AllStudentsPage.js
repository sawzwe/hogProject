import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// routers
import { Link } from 'react-router-dom';
// components
import { useSettingsContext } from '../../components/settings';

// ----------------------------------------------------------------------

export default function AllStudentsPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> EP STUDENTS </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h3" component="h1" paragraph>
                    All Students
                </Typography>

                <Typography variant="p" component="p" paragraph>
                    <Link to="student/1/edit">Dummy Student</Link>
                </Typography>
            </Container>
        </>
    );
}

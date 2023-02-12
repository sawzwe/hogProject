import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';

// ----------------------------------------------------------------------

export default function StudentCoursePage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <>
                <Helmet>
                    <title> Courses </title>
                </Helmet>

                <Container maxWidth={themeStretch ? false : 'xl'}>
                    <Typography variant="h4" gutterBottom>
                        StudentCoursePage
                    </Typography>
                </Container>
            </>
        </>
    );
}

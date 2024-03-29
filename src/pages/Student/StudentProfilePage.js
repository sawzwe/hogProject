import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';

// ----------------------------------------------------------------------

export default function StudentProfilePage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> Student Profile </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h4" gutterBottom>
                    Student Profile
                </Typography>
            </Container>
        </>
    );
}

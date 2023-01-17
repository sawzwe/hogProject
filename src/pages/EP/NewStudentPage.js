import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';

// ----------------------------------------------------------------------

export default function NewStudentPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> EP | New Student </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h3" component="h1" paragraph>
                    Hello
                </Typography>

                <Typography gutterBottom>
                    Saw, you need to learn MUI Components and Template's Components. If you found compoenents on MUI, check if it's 
                    in template's components in components folder or not, and try to use template's components first. If it didn't work,
                    then you may use components from MUI.
                </Typography>

                <Typography>
                    Just a text
                </Typography>
            </Container>
        </>
    );
}

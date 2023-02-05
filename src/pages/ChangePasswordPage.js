import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../components/settings';
// sections
import AuthChangePasswordForm from '../sections/auth/AuthChangePasswordForm';
// assets
// import { PasswordIcon } from '../../assets/icons';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> Change Password </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                {/* <PasswordIcon sx={{ mb: 5, height: 96 }} /> */}
                    <Typography variant="h3" paragraph>
                        Change password
                    </Typography>

                    <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                        You will be logged out after changing the password.
                    </Typography>

                    <AuthChangePasswordForm />
            </Container>
        </>
    );
}

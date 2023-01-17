import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Link, Stack, Container, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from '../routes/paths';
// components
import Iconify from '../components/iconify';
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
                <title> Change Password | Minimal UI</title>
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

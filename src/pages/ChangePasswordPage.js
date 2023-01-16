import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Link, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from '../routes/paths';
// components
import Iconify from '../components/iconify';
// sections
import AuthChangePasswordForm from '../sections/auth/AuthChangePasswordForm';
// assets
// import { PasswordIcon } from '../../assets/icons';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
    return (
        <>
            <Helmet>
                <title> Reset Password | Minimal UI</title>
            </Helmet>

            {/* <PasswordIcon sx={{ mb: 5, height: 96 }} /> */}

            <Typography variant="h3" paragraph>
                Change password
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                Please enter the email address associated with your account and We will email you a link to
                reset your password.
            </Typography>

            <AuthChangePasswordForm />
        </>
    );
}

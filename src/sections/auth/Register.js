import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Stack, Typography, Link } from '@mui/material';
// hooks
import { useAuthContext } from '../../auth/useAuthContext';
// layouts
import LoginLayout from '../../layouts/login';
// routes
import { PATH_AUTH } from '../../routes/paths';
//
import AuthRegisterForm from './AuthRegisterForm';
// import AuthWithSocial from './AuthWithSocial';

// ----------------------------------------------------------------------

export default function Register() {

    return (
        <LoginLayout>
            <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
                <Typography variant="h4">Get started absolutely free.</Typography>

                <Stack direction="row" spacing={0.5}>
                    <Typography variant="body2">Already have an account?</Typography>

                    <Link to={PATH_AUTH.login} variant="subtitle2" component={RouterLink}>Sign In</Link>
                </Stack>
            </Stack>

            <AuthRegisterForm />

            {/* <AuthWithSocial /> */}
        </LoginLayout>
    );
}

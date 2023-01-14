import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Alert, Tooltip, Stack, Typography, Link, Box } from '@mui/material';
// hooks
import { useAuthContext } from '../../auth/useAuthContext';
// layouts
import LoginLayout from '../../layouts/login';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import AuthLoginForm from './AuthLoginForm';
// import AuthWithSocial from './AuthWithSocial';

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuthContext();

  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Sign in to Minimal</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">New user?</Typography>

          <Link to={PATH_AUTH.register} component={RouterLink} variant="subtitle2">Create an account</Link>
        </Stack>

        <Tooltip title={method} placement="left">
          <Box
            component="img"
            alt={method}
            src={`/assets/icons/auth/ic_${method}.png`}
            sx={{ width: 32, height: 32, position: 'absolute', right: 0 }}
          />
        </Tooltip>
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        Use email : <strong>u6311020@au.edu</strong> <br />password :<strong> 123456</strong>
      </Alert>

      <AuthLoginForm />

      {/* <AuthWithSocial /> */}
    </LoginLayout>
  );
}

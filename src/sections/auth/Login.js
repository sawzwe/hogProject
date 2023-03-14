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
import Logo from '../../components/logo';
import hog from '../../assets/logo/hogLogo.png';
// import AuthWithSocial from './AuthWithSocial';

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuthContext();

  return (
    <LoginLayout>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4, position: 'relative' }}>
        <Stack direction="column">
          <Typography variant="h4">Sign In</Typography>
          <Typography variant="body1">to House of Griffin</Typography>
        </Stack>
        <Tooltip title={'Firebase Auth'} placement="left">
          <Box
            component="img"
            alt={method}
            src={`/assets/icons/auth/ic_${method}.png`}
            sx={{ width: 38, height: 38, position: 'absolute', right: 0 }}
          />
          {/* <Box
            component="img"
            src={hog}
            sx={{ width: '2.5em', height: '3em', position: 'absolute', right: 0 }}
          /> */}

        </Tooltip>
      </Stack>

      <AuthLoginForm />
    </LoginLayout>
  );
}

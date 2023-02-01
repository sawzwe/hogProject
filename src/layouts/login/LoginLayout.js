import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
// components
import Logo from '../../components/logo';
//
import { StyledRoot, StyledContent } from './styles';

// ----------------------------------------------------------------------

LoginLayout.propTypes = {
  children: PropTypes.node,
};

export default function LoginLayout({ children }) {
  return (
    <StyledRoot>
      <Logo
        sx={{
          zIndex: 9,
          position: 'absolute',
          mt: { xs: 1.5, md: 5 },
          ml: { xs: 2, md: 5 },
        }}
      />
  
      <StyledContent>
        <Stack sx={{ width: 1, paddingTop: 0 }}> {children} </Stack>
      </StyledContent>
    </StyledRoot>
  );
}

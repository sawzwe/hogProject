import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';
import hog from '../../assets/logo/hogLogo.png';


// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx }, ref) => {
  const theme = useTheme();

  const logo = (
    <Box 
    component="img"
    src={hog}
    sx={{ width: '2.5em', height: '3em', cursor: 'pointer', ...sx }}
    />
  );

if (disabledLink) {
  return <>{logo}</>;
}

return (
  <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
    {logo}
  </Link>
);
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;

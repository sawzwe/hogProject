// @mui
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import LockResetIcon from '@mui/icons-material/LockReset';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';
// icons
// import GroupIcon from '@mui/icons-material/Group';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  user: icon('ic_user'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  blog: icon('ic_blog'),
  mail: icon('ic_mail'),
  menuItem: icon('ic_menu_item'),
  file:icon('ic_file'),
  group: <GroupIcon />,
  changePassword: <LockResetIcon />,
  logout: <LogoutIcon />
};

const navConfig = [
  // Student Management
  // ----------------------------------------------------------------------
  {
    subheader: 'student management',
    items: [
      { title: 'New Student', path: PATH_DASHBOARD.one, icon: ICONS.user },
      { title: 'All Students', path: PATH_DASHBOARD.two, icon: ICONS.group },
    ],
  },

  // Course Registration
  // ----------------------------------------------------------------------
  {
    subheader: 'course registration',
    items: [
      {title: 'Create Request', path: PATH_DASHBOARD.user.root, icon: ICONS.mail },
      {title: 'Request Status', path: PATH_DASHBOARD.user.root, icon: ICONS.menuItem }
    ],
  },

  // Schedule Management
  // ----------------------------------------------------------------------
  {
    subheader: 'schedule management',
    items: [
      {title: 'Course Transfer Request', path: PATH_DASHBOARD.user.root, icon: ICONS.file }
    ],
  },

  // Settings
  // ----------------------------------------------------------------------
  {
    subheader: 'Settings',
    items: [
      {title: 'Reset Password', path: PATH_DASHBOARD.user.root, icon: ICONS.changePassword },
      {title: 'Logout', path: PATH_DASHBOARD.user.root, icon: ICONS.logout }
    ],
  }
];

export default navConfig;

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  user: icon('ic_user'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

const navConfig = [
  // Student Management
  // ----------------------------------------------------------------------
  {
    subheader: 'student management',
    items: [
      { title: 'New Student', path: PATH_DASHBOARD.one, icon: ICONS.dashboard },
      { title: 'All Students', path: PATH_DASHBOARD.two, icon: ICONS.ecommerce },
    ],
  },

  // Course Registration
  // ----------------------------------------------------------------------
  {
    subheader: 'course registration',
    items: [
      {title: 'Create Request', path: PATH_DASHBOARD.user.root, icon: ICONS.user,},
      {title: 'Request Status', path: PATH_DASHBOARD.user.root, icon: ICONS.user,}
    ],
  },

  // Schedule Management
  // ----------------------------------------------------------------------
  {
    subheader: 'schedule management',
    items: [
      {title: 'Course Transfer Request', path: PATH_DASHBOARD.user.root, icon: ICONS.user,}
    ],
  }
];

export default navConfig;

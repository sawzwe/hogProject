// @mui
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import LockResetIcon from '@mui/icons-material/LockReset';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';
// icons
// import GroupIcon from '@mui/icons-material/Group';


// ----------------------------------------------------------------------


const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  user: icon('ic_user'),
  calendar: icon('ic_calendar'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  blog: icon('ic_blog'),
  mail: icon('ic_mail'),
  menuItem: icon('ic_menu_item'),
  file: icon('ic_file'),
  group: <GroupIcon />,
  changePassword: <LockResetIcon />,
  logout: <LogoutIcon />
};

// ----------------------------------------------------------------------
// Education Planner navConfig

const EPNavConfig = [
  // Student Management
  // ----------------------------------------------------------------------
  {
    subheader: 'student management',
    items: [
      {
        title: 'search student',
        path: PATH_DASHBOARD.studentManagement.root,
        icon: ICONS.user,
        children: [
          { title: 'personal detail', path: PATH_DASHBOARD.studentManagement.searchStudent },
          { title: 'course detail', path: PATH_DASHBOARD.studentManagement.searchCourseStudent },
        ],
      },
      { title: 'new student', path: PATH_DASHBOARD.newStudent, icon: ICONS.user },
    ],
  },

  // Course Management
  // ----------------------------------------------------------------------
  {
    subheader: 'course management',
    items: [
      {
        title: 'course registration',
        path: PATH_DASHBOARD.courseRegistration.root,
        icon: ICONS.mail,
        children: [
          { title: 'Create Request', path: PATH_DASHBOARD.courseRegistration.createRequest },
          { title: 'Request Status', path: PATH_DASHBOARD.courseRegistration.requestStatus },
        ]
      },
      {
        title: 'course transferring',
        path: PATH_DASHBOARD.courseTransferring.root,
        icon: ICONS.file,
        children: [
          { title: 'Create Request', path: PATH_DASHBOARD.courseTransferring.createRequest },
          { title: 'Request Status', path: PATH_DASHBOARD.courseTransferring.requestStatus },
        ]
      },
    ],
  },

  // // Settings
  // // ----------------------------------------------------------------------
  {
    subheader: 'Settings',
    items: [
      { title: 'Change Password', path: PATH_DASHBOARD.changePassword, icon: ICONS.changePassword },
      { title: 'Logout', path: PATH_AUTH.login, icon: ICONS.logout }
    ],
  }
];

// ----------------------------------------------------------------------
// Education Admin navConfig

const EANavConfig = [
  // Schedule Management
  // ----------------------------------------------------------------------
  {
    subheader: 'schedule management',
    items: [
      { title: 'Daily Calendar', path: PATH_DASHBOARD.dailyCalendar, icon: ICONS.calendar },
    ],
  },

  // Students and Teachers Management
  // ----------------------------------------------------------------------
  {
    subheader: 'students and teachers',
    items: [
      {
        title: 'student',
        path: PATH_DASHBOARD.studentManagement.root,
        icon: ICONS.user,
        children: [
          { title: 'personal detail', path: PATH_DASHBOARD.studentManagement.searchStudent },
          { title: 'course detail', path: PATH_DASHBOARD.studentManagement.searchCourseStudent },
        ],
      },
      {
        title: 'teacher',
        path: PATH_DASHBOARD.teacherManagement.root,
        icon: ICONS.user,
        children: [
          { title: 'personal detail', path: PATH_DASHBOARD.teacherManagement.searchTeacher },
          { title: 'course detail', path: PATH_DASHBOARD.teacherManagement.searchCourseTeacher },
        ],
      },
    ],
  },

  // Request Management
  // ----------------------------------------------------------------------
  {
    subheader: 'request management',
    items: [
      { title: 'registration request', path: PATH_DASHBOARD.registrationRequest, icon: ICONS.mail },
      {
        title: 'schedule request',
        path: PATH_DASHBOARD.requestManagement.root,
        icon: ICONS.file,
        children: [
          { title: 'student', path: PATH_DASHBOARD.requestManagement.studentRequest },
          { title: 'staff', path: PATH_DASHBOARD.requestManagement.staffRequest },
        ],
      },
    ]
  },

  // Settings
  // ----------------------------------------------------------------------
  {
    subheader: 'Settings',
    items: [
      { title: 'Change Password', path: PATH_DASHBOARD.changePassword, icon: ICONS.changePassword },
      { title: 'Logout', path: PATH_AUTH.login, icon: ICONS.logout }
    ],
  }
];

// ----------------------------------------------------------------------
// Office Admin NavConfig

const OANavConfig = [
  // Account management
  // ----------------------------------------------------------------------
  {
    subheader: 'account management',
    items: [
      { title: 'New Account', path: PATH_DASHBOARD.newAccount, icon: ICONS.user },
      {
        title: 'Edit Account',
        path: PATH_DASHBOARD.editAccount.root,
        icon: ICONS.group,
        children: [
          { title: 'Student', path: PATH_DASHBOARD.editAccount.student },
          { title: 'Teacher', path: PATH_DASHBOARD.editAccount.teacher },
          { title: 'Staff', path: PATH_DASHBOARD.editAccount.staff },
        ],
      },
    ],
  },

  // Request management
  // ----------------------------------------------------------------------
  {
    subheader: 'request management',
    items: [
      { title: 'Registration Request', path: PATH_DASHBOARD.registrationRequestOA, icon: ICONS.user },
      { title: 'Leaving Request', path: PATH_DASHBOARD.leavingRequestOA, icon: ICONS.group },
    ],
  },

  // Settings
  // ----------------------------------------------------------------------
  {
    subheader: 'Settings',
    items: [
      { title: 'Change Password', path: PATH_DASHBOARD.changePassword, icon: ICONS.changePassword },
      { title: 'Logout', path: PATH_AUTH.login, icon: ICONS.logout }
    ],
  }
];

// ----------------------------------------------------------------------
// Student NavConfig

const StudentNavConfig = [
  // General
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'Calendar', path: PATH_DASHBOARD.studentCalendar, icon: ICONS.user },
      { title: 'Course', path: PATH_DASHBOARD.studentCourse, icon: ICONS.mail },
    ],
  },

  // Others
  // ----------------------------------------------------------------------
  {
    subheader: 'others',
    items: [
      { title: 'Profile', path: PATH_DASHBOARD.studentProfile, icon: ICONS.user },
      { title: 'Request Inbox', path: PATH_DASHBOARD.studentInbox, icon: ICONS.mail },
    ],
  },

  // Settings
  // ----------------------------------------------------------------------
  {
    subheader: 'Settings',
    items: [
      { title: 'Change Password', path: PATH_DASHBOARD.changePassword, icon: ICONS.changePassword },
      { title: 'Logout', path: PATH_AUTH.login, icon: ICONS.logout }
    ],
  }
];

// ----------------------------------------------------------------------
// Teacher NavConfig

const TeacherNavConfig = [
  // General
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'Calendar', path: PATH_DASHBOARD.teacherCalendar, icon: ICONS.user },
      { title: 'Course', path: PATH_DASHBOARD.teacherCourse, icon: ICONS.mail },
    ],
  },

  // Others
  // ----------------------------------------------------------------------
  {
    subheader: 'request management',
    items: [
      { title: 'Leaving Request', path: PATH_DASHBOARD.teacherLeavingRequest, icon: ICONS.user },
      { title: 'Request History', path: PATH_DASHBOARD.teacherInbox, icon: ICONS.mail },
    ],
  },

  // Settings
  // ----------------------------------------------------------------------
  {
    subheader: 'Settings',
    items: [
      { title: 'Change Password', path: PATH_DASHBOARD.changePassword, icon: ICONS.changePassword },
      { title: 'Logout', path: PATH_AUTH.login, icon: ICONS.logout }
    ],
  }
];


export { EPNavConfig, EANavConfig, OANavConfig, StudentNavConfig, TeacherNavConfig };

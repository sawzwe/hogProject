// @mui
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import LockResetIcon from '@mui/icons-material/LockReset';
import LibraryAddRoundedIcon from '@mui/icons-material/LibraryAddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
// routes
import { PATH_AUTH, PATH_ACCOUNT, PATH_REGISTRATION, PATH_COURSE_TRANSFER, PATH_SCHEDULE_CHANGING } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';
// icons
// import GroupIcon from '@mui/icons-material/Group';


// ----------------------------------------------------------------------


const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  user: icon('ic_user'),
  newUser: <LibraryAddRoundedIcon />,
  editUser: <EditRoundedIcon />,
  leave: <CallReceivedIcon />,
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
  logout: <LogoutIcon />,
  teacher: <AssignmentIndIcon />
};

// ----------------------------------------------------------------------
// Education Planner navConfig

const EPNavConfig = [
  // Student Management
  {
    subheader: 'student management',
    items: [
      {
        title: 'search student',
        path: PATH_ACCOUNT.studentManagement.root,
        icon: ICONS.user,
        children: [
          { title: 'personal detail', path: PATH_ACCOUNT.studentManagement.searchStudent },
          { title: 'course detail', path: PATH_ACCOUNT.studentManagement.searchCourseStudent },
        ],
      },
      { title: 'new student', path: 'new-student', icon: ICONS.newUser },
    ],
  },

  // Course Registration and Course Transfer Management
  {
    subheader: 'course management',
    items: [
      {
        title: 'course registration',
        path: PATH_REGISTRATION.root,
        icon: ICONS.mail,
        children: [
          { title: 'Create Request', path: PATH_REGISTRATION.createRequest },
          { title: 'Request Status', path: PATH_REGISTRATION.epRequestStatus },
        ]
      },
      // {
      //   title: 'course transferring',
      //   path: PATH_COURSE_TRANSFER.root,
      //   icon: ICONS.file,
      //   children: [
      //     { title: 'Create Request', path: PATH_COURSE_TRANSFER.createRequest},
      //     { title: 'Request Status', path: PATH_COURSE_TRANSFER.epCourseTransferRequest },
      //   ]
      // },
    ],
  },

  // Settings
  {
    subheader: 'Settings',
    items: [
      { title: 'Change Password', path: PATH_AUTH.changePassword, icon: ICONS.changePassword },
      { title: 'Logout', path: PATH_AUTH.login, icon: ICONS.logout }
    ],
  }
];

// ----------------------------------------------------------------------
// Education Admin navConfig

const EANavConfig = [
  // Schedule Management
  {
    subheader: 'schedule management',
    items: [
      { title: 'Daily Calendar', path: 'daily-calendar', icon: ICONS.calendar },
    ],
  },

  // Students and Teachers Management
  {
    subheader: 'account management',
    items: [
      {
        title: 'student',
        path: PATH_ACCOUNT.studentManagement.root,
        icon: ICONS.user,
        children: [
          { title: 'personal detail', path: PATH_ACCOUNT.studentManagement.searchStudent },
          { title: 'course detail', path: PATH_ACCOUNT.studentManagement.searchCourseStudent },
        ],
      },
      {
        title: 'teacher',
        path: PATH_ACCOUNT.teacherManagement.root,
        icon: ICONS.teacher,
        children: [
          { title: 'personal detail', path: PATH_ACCOUNT.teacherManagement.searchTeacher },
          { title: 'course detail', path: PATH_ACCOUNT.teacherManagement.searchCourseTeacher },
        ],
      },
    ],
  },

  // Request Management
  {
    subheader: 'request management',
    items: [
      { title: 'registration request', path: PATH_REGISTRATION.eaRequestStatus, icon: ICONS.mail },
      // {
      //   title: 'schedule request',
      //   path: PATH_SCHEDULE_CHANGING.root,
      //   icon: ICONS.file,
      //   children: [
      //     { title: 'student', path: PATH_SCHEDULE_CHANGING.studentRequest },
      //     { title: 'staff', path: PATH_SCHEDULE_CHANGING.staffRequest },
      //   ],
      // },
    ]
  },

  // Settings
  {
    subheader: 'Settings',
    items: [
      { title: 'Change Password', path: PATH_AUTH.changePassword, icon: ICONS.changePassword },
      { title: 'Logout', path: PATH_AUTH.login, icon: ICONS.logout }
    ],
  }
];

// ----------------------------------------------------------------------
// Office Admin NavConfig

const OANavConfig = [
  // Account management
  {
    subheader: 'account management',
    items: [
      { title: 'New Account', path: 'new-staff', icon: ICONS.newUser },
      {
        title: 'Edit Account',
        path: PATH_ACCOUNT.root,
        icon: ICONS.editUser,
        children: [
          { title: 'Student', path: PATH_ACCOUNT.studentManagement.searchStudent },
          { title: 'Teacher', path: PATH_ACCOUNT.teacherManagement.searchTeacher },
          { title: 'Staff', path: PATH_ACCOUNT.staffManagement.searchStaff },
        ],
      },
    ],
  },

  // Request management
  {
    subheader: 'request management',
    items: [
      { title: 'Registration Request', path: PATH_REGISTRATION.oaRequestStatus, icon: ICONS.mail },
      // { title: 'Leaving Request', path: 'schedule-changing/leaving-request', icon: ICONS.leave },
    ],
  },

  // Settings
  {
    subheader: 'Settings',
    items: [
      { title: 'Change Password', path: PATH_AUTH.changePassword, icon: ICONS.changePassword },
      { title: 'Logout', path: PATH_AUTH.login, icon: ICONS.logout }
    ],
  }
];

// ----------------------------------------------------------------------
// Student NavConfig

const StudentNavConfig = [
  // General
  {
    subheader: 'general',
    items: [
      { title: 'Calendar', path: 'student-calendar', icon: ICONS.user },
      { title: 'Course', path: 'student-course', icon: ICONS.mail },
    ],
  },

  // Others
  // {
  //   subheader: 'others',
  //   items: [
  //     { title: 'Profile', path: 'student-profile', icon: ICONS.user },
  //     { title: 'Request Inbox', path: 'student-inbox', icon: ICONS.mail },
  //   ],
  // },

  // Settings
  {
    subheader: 'Settings',
    items: [
      { title: 'Change Password', path: PATH_AUTH.changePassword, icon: ICONS.changePassword },
      { title: 'Logout', path: PATH_AUTH.login, icon: ICONS.logout }
    ],
  }
];

// ----------------------------------------------------------------------
// Teacher NavConfig

const TeacherNavConfig = [
  // General
  {
    subheader: 'general',
    items: [
      { title: 'Calendar', path: 'teacher-calendar', icon: ICONS.user },
      { title: 'Course', path: 'teacher-course', icon: ICONS.mail },
    ],
  },

  // Others
  {
    subheader: 'request management',
    items: [
      { title: 'Leaving Request', path: 'teacher-leaving-request', icon: ICONS.user },
      { title: 'Request History', path: 'teacher-inbox', icon: ICONS.mail },
    ],
  },

  // Settings
  {
    subheader: 'Settings',
    items: [
      { title: 'Change Password', path: PATH_AUTH.changePassword, icon: ICONS.changePassword },
      { title: 'Logout', path: PATH_AUTH.login, icon: ICONS.logout }
    ],
  }
];

// ----------------------------------------------------------------------
// Error NavConfig

const BugNavConfig = [
  {
    subheader: 'Settings',
    items: [
      { title: 'Logout', path: PATH_AUTH.login, icon: ICONS.logout }
    ],
  }
];


export { EPNavConfig, EANavConfig, OANavConfig, StudentNavConfig, TeacherNavConfig, BugNavConfig };

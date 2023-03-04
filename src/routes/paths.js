// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

// const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_ACCOUNT = '/account';
const ROOTS_REGISTRATION = '/course-registration';
const ROOTS_SCHEDULE_CHANGING = '/schedule-changing';
const ROOTS_COURSE_TRANSFER = '/course-transfer';


// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
  changePassword: '/change-password',
};

// Create and Search Account
export const PATH_ACCOUNT = {
  root: ROOTS_ACCOUNT,
  studentManagement: {
    root: path(ROOTS_ACCOUNT, '/student-management'),
    searchStudent: path(ROOTS_ACCOUNT, '/student-management/student'),
    searchCourseStudent: path(ROOTS_ACCOUNT, '/student-management/student-course'),
  },
  teacherManagement: {
    root: path(ROOTS_ACCOUNT, '/teacher-management'),
    searchTeacher: path(ROOTS_ACCOUNT, '/teacher-management/teacher'),
    searchCourseTeacher: path(ROOTS_ACCOUNT, '/teacher-management/teacher-course'),
  },
  staffManagement: {
    root: path(ROOTS_ACCOUNT, '/staff-management'),
    searchStaff: path(ROOTS_ACCOUNT, '/staff-management/staff'),
  },
}

// Registration Request
export const PATH_REGISTRATION = {
  root: ROOTS_REGISTRATION,
  createRequest: path(ROOTS_REGISTRATION, '/create-request'),
  eaRequestStatus: path(ROOTS_REGISTRATION, '/ea-request-status'),
  oaRequestStatus: path(ROOTS_REGISTRATION, '/oa-request-status'),
  epRequestStatus: path(ROOTS_REGISTRATION, '/ep-request-status'),
}

// Schedule Changing Request
export const PATH_SCHEDULE_CHANGING = {
  root: ROOTS_SCHEDULE_CHANGING,
  studentRequest: path(ROOTS_SCHEDULE_CHANGING, '/student-request'),
  staffRequest: path(ROOTS_SCHEDULE_CHANGING, '/staff-request'),
  oaLeavingRequest: path(ROOTS_SCHEDULE_CHANGING, '/oa-leaving-request'),
  eaLeavingRequest: path(ROOTS_SCHEDULE_CHANGING, '/ea-leaving-request'),
}

// Course Transfer
export const PATH_COURSE_TRANSFER = {
  root: ROOTS_COURSE_TRANSFER,
  createRequest: path(ROOTS_COURSE_TRANSFER, '/create-request'),
  epCourseTransferRequest: path(ROOTS_COURSE_TRANSFER, '/ep-request-status'),
}


// export const PATH_DASHBOARD = {
//   root: ROOTS_DASHBOARD,
//   accountManagement: {
//     root: path(ROOTS_DASHBOARD, '/student-management'),
//     searchStudent: path(ROOTS_DASHBOARD, '/student-management/search-student'),
//     searchTeacher: path(ROOTS_DASHBOARD, '/student-management/search-teacher'),
//     searchStaff: path(ROOTS_DASHBOARD, '/student-management/search-staff'),
//   },
//   studentManagement: {
//     root: path(ROOTS_DASHBOARD, '/student-management'),
//     searchStudent: path(ROOTS_DASHBOARD, '/student-management/search-student'),
//     searchCourseStudent: path(ROOTS_DASHBOARD, '/student-management/search-course'),
//   },
//   teacherManagement: {
//     root: path(ROOTS_DASHBOARD, '/teacher-management'),
//     searchTeacher: path(ROOTS_DASHBOARD, '/teacher-management/search-teacher'),
//     searchCourseTeacher: path(ROOTS_DASHBOARD, '/teacher-management/search-course'),
//   },
//   newStudent: path(ROOTS_DASHBOARD, '/new-student'),
//   courseRegistration: {
//     root: path(ROOTS_DASHBOARD, '/course-registration'),
//     createRequest: path(ROOTS_DASHBOARD, '/course-registration/create-request'),
//     requestStatus: path(ROOTS_DASHBOARD, '/course-registration/request-status'),
//   },
//   courseTransferring: {
//     root: path(ROOTS_DASHBOARD, '/course-transfer'),
//     createRequest: path(ROOTS_DASHBOARD, '/course-transfer/create-request'),
//     requestStatus: path(ROOTS_DASHBOARD, '/course-transfer/request-status'),
//   },
//   dailyCalendar: path(ROOTS_DASHBOARD, '/daily-calendar'),

//   // EA Registration Request
//   registrationRequest: path(ROOTS_DASHBOARD, '/registration-request'),

//   // EA Course Transfer and Leaving Request
//   requestManagement: {
//     root: path(ROOTS_DASHBOARD, '/request-management'),
//     studentRequest: path(ROOTS_DASHBOARD, '/request-management/student-request'),
//     staffRequest: path(ROOTS_DASHBOARD, '/request-management/staff-request'),
//   },
//   changePassword: path(ROOTS_DASHBOARD, '/changePassword'),

//   // OA New Account
//   newAccount: path(ROOTS_DASHBOARD, '/new-account'),
//   editAccount: {
//     root: path(ROOTS_DASHBOARD, '/edit-account'),
//     student: path(ROOTS_DASHBOARD, '/edit-account/student'),
//     teacher: path(ROOTS_DASHBOARD, '/edit-account/teacher'),
//     staff: path(ROOTS_DASHBOARD, '/edit-account/staff'),
//   },
//   registrationRequestOA: path(ROOTS_DASHBOARD, '/registration-request-office-admin'),
//   leavingRequestOA: path(ROOTS_DASHBOARD, '/leaving-request-office-admin'),

//   // Student
//   studentCalendar: path(ROOTS_DASHBOARD, '/student-calendar'),
//   studentCourse: path(ROOTS_DASHBOARD, '/student-course'),
//   studentProfile: path(ROOTS_DASHBOARD, '/student-profile'),
//   studentInbox: path(ROOTS_DASHBOARD, '/student-inbox'),

//   // Teacher
//   teacherCalendar: path(ROOTS_DASHBOARD, '/teacher-calendar'),
//   teacherCourse: path(ROOTS_DASHBOARD, '/teacher-course'),
//   teacherLeavingRequest: path(ROOTS_DASHBOARD, '/teacher-leaving-request'),
//   teacherInbox: path(ROOTS_DASHBOARD, '/teacher-inbox'),
// };
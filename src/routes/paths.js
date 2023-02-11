// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
  register: '/register'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  studentManagement: {
    root: path(ROOTS_DASHBOARD, '/student-management'),
    searchStudent: path(ROOTS_DASHBOARD, '/student-management/search-student'),
    edit: (id) => path(ROOTS_DASHBOARD, `/student-management/search-student/${id}/edit`),
    searchCourseStudent: path(ROOTS_DASHBOARD, '/student-management/search-course'),
  },
  teacherManagement: {
    root: path(ROOTS_DASHBOARD, '/teacher-management'),
    searchTeacher: path(ROOTS_DASHBOARD, '/teacher-management/search-teacher'),
    searchCourseTeacher: path(ROOTS_DASHBOARD, '/teacher-management/search-course'),
  },
  newStudent: path(ROOTS_DASHBOARD, '/new-student'),
  courseRegistration: {
    root: path(ROOTS_DASHBOARD, '/course-registration'),
    createRequest: path(ROOTS_DASHBOARD, '/course-registration/create-request'),
    requestStatus: path(ROOTS_DASHBOARD, '/course-registration/request-status'),
  },
  courseTransferring: {
    root: path(ROOTS_DASHBOARD, '/course-transfer'),
    createRequest: path(ROOTS_DASHBOARD, '/course-transfer/create-request'),
    requestStatus: path(ROOTS_DASHBOARD, '/course-transfer/request-status'),
    view: (id) => path(ROOTS_DASHBOARD, `/course-transfer/request-status/${id}`)
  },
  dailyCalendar: path(ROOTS_DASHBOARD, '/daily-calendar'),
  
  // EA Registration Request
  registrationRequest: path(ROOTS_DASHBOARD, '/registration-request'),
  schedule: (id) => path(ROOTS_DASHBOARD, `/registration-request/${id}`),

  // EA Course Transfer and Leaving Request
  requestManagement: {
    root: path(ROOTS_DASHBOARD, '/request-management'),
    studentRequest: path(ROOTS_DASHBOARD, '/request-management/student-request'),
    staffRequest: path(ROOTS_DASHBOARD, '/request-management/staff-request'),
  },
  changePassword: path(ROOTS_DASHBOARD, '/changePassword'),

  // OA New Account
  newAccount: path(ROOTS_DASHBOARD, '/new-account'),
  editAccount: {
    root: path(ROOTS_DASHBOARD, '/edit-account'),
    student: path(ROOTS_DASHBOARD, '/edit-account/student'),
    teacher: path(ROOTS_DASHBOARD, '/edit-account/teacher'),
    staff: path(ROOTS_DASHBOARD, '/edit-account/staff'),
    editStudent: (id) => path(ROOTS_DASHBOARD, `/edit-account/student/${id}`),
    editTeacher: (id) => path(ROOTS_DASHBOARD, `/edit-account/teacher/${id}`),
    editStaff: (id) => path(ROOTS_DASHBOARD, `/edit-account/staff/${id}`),
  },
  registrationRequestOA: path(ROOTS_DASHBOARD, '/registration-request-office-admin'),
  leavingRequestOA: path(ROOTS_DASHBOARD, '/leaving-request-office-admin'),

  // Student
  studentCalendar: path(ROOTS_DASHBOARD, '/student-calendar'),
  studentCourse: path(ROOTS_DASHBOARD, '/student-course'),
  studentProfile: path(ROOTS_DASHBOARD, '/student-profile'),
  studentInbox: path(ROOTS_DASHBOARD, '/student-inbox'),

  // Teacher
  teacherCalendar: path(ROOTS_DASHBOARD, '/teacher-calendar'),
  teacherCourse: path(ROOTS_DASHBOARD, '/teacher-course'),
  teacherLeavingRequest: path(ROOTS_DASHBOARD, '/teacher-leaving-request'),
  teacherInbox: path(ROOTS_DASHBOARD, '/teacher-inbox'),
};
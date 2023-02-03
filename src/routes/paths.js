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
  },
  dailyCalendar: path(ROOTS_DASHBOARD, '/daily-calendar'),
  registrationRequest: path(ROOTS_DASHBOARD, '/registration-request'),
  requestManagement: {
    root: path(ROOTS_DASHBOARD, '/request-management'),
    studentRequest: path(ROOTS_DASHBOARD, '/request-management/student-request'),
    staffRequest: path(ROOTS_DASHBOARD, '/request-management/staff-request'),
  },
  changePassword: path(ROOTS_DASHBOARD, '/changePassword'),
};
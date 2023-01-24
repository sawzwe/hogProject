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
  newStudent: path(ROOTS_DASHBOARD, '/new-student'),
  search: path(ROOTS_DASHBOARD, '/search'),
  edit: (id) => path(ROOTS_DASHBOARD, `/student/${id}/edit`),
  createRegistrationRequest: path(ROOTS_DASHBOARD, '/create-registration-request'),
  registrationRequestStatus: path(ROOTS_DASHBOARD, '/registration-request-status'),
  createCourseTransferRequest: path(ROOTS_DASHBOARD, '/create-course-transfer-request'),
  courseTransferRequestStatus: path(ROOTS_DASHBOARD, '/course-transfer-request-status'),
  changePassword: path(ROOTS_DASHBOARD, '/changePassword'),
};
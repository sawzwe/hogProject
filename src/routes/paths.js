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
  newStudent: path(ROOTS_DASHBOARD, '/newStudent'),
  allStudents: path(ROOTS_DASHBOARD, '/allStudents'),
  createRequest: path(ROOTS_DASHBOARD, '/createRequest'),
  requestStatus: path(ROOTS_DASHBOARD, '/requestStatus'),
  courseTransferRequest: path(ROOTS_DASHBOARD, '/courseTransferRequest'),
  changePassword: path(ROOTS_DASHBOARD, '/changePassword'),
};
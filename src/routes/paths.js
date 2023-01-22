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
  edit: (id) => path(ROOTS_DASHBOARD, `/student/${id}/edit`),
  createRequest: path(ROOTS_DASHBOARD, '/createRequest'),
  requestStatus: path(ROOTS_DASHBOARD, '/requestStatus'),
  courseTransferRequest: path(ROOTS_DASHBOARD, '/courseTransferRequest'),
  changePassword: path(ROOTS_DASHBOARD, '/changePassword'),
};
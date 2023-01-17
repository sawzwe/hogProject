// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

const ROOTS_EP_DASHBOARD = '/epdashboard';

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

export const PATH_EP_DASHBOARD = {
  root: ROOTS_EP_DASHBOARD,
  epone: path(ROOTS_EP_DASHBOARD, '/epone'),
  eptwo: path(ROOTS_EP_DASHBOARD, '/eptwo'),
  epthree: path(ROOTS_EP_DASHBOARD, '/epthree'),
};
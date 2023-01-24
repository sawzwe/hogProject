import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

export const LoginPage = Loadable(lazy(() => import('../pages/LoginPage')));
export const RegisterPage = Loadable(lazy(() => import('../pages/RegisterPage')));

export const PageNewStdent = Loadable(lazy(() => import('../pages/EP/NewStudentPage')));
export const PageAllStudents = Loadable(lazy(() => import('../pages/EP/AllStudentsPage')));
export const PageEditStudent = Loadable(lazy(() => import('../pages/EP/EditStudentPage')));
export const PageCreateRequest = Loadable(lazy(() => import('../pages/EP/CreateRequestPage')));
export const PageRequestStatus = Loadable(lazy(() => import('../pages/EP/RequestStatusPage')));
export const PageCourseTransferRequest = Loadable(lazy(() => import('../pages/EP/CourseTransferRequestPage')));
export const PageChangePassword = Loadable(lazy(() => import('../pages/ChangePasswordPage')));

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));

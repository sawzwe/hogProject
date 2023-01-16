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
export const PageAllStdents = Loadable(lazy(() => import('../pages/EP/AllStudentsPage')));
export const PageCreateRequest = Loadable(lazy(() => import('../pages/EP/CreateRequestPage')));
export const PageRequestStatus = Loadable(lazy(() => import('../pages/EP/RequestStatusPage')));
export const PageCourseTransferRequest = Loadable(lazy(() => import('../pages/EP/CourseTransferRequestPage')));
export const PageChangePassword = Loadable(lazy(() => import('../pages/ChangePasswordPage')));




export const PageTwo = Loadable(lazy(() => import('../pages/PageTwo')));
export const PageThree = Loadable(lazy(() => import('../pages/PageThree')));
export const PageFour = Loadable(lazy(() => import('../pages/PageFour')));
export const PageFive = Loadable(lazy(() => import('../pages/PageFive')));
export const PageSix = Loadable(lazy(() => import('../pages/PageSix')));

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));

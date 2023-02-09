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

export const PageEditStudent = Loadable(lazy(() => import('../pages/EP/EditStudentPage')));
export const PageChangePassword = Loadable(lazy(() => import('../pages/ChangePasswordPage')));

// EP ----------------------------------------------------------------------
export const PageNewStdent = Loadable(lazy(() => import('../pages/EP/NewStudentPage')));

export const PageCreateRegistrationRequest = Loadable(lazy(() => import('../pages/EP/CreateRegistrationRequestPage')));
export const PageRegistrationRequestStatus = Loadable(lazy(() => import('../pages/EP/RegistrationRequestStatusPage')));
export const PageRegistrationRequestDetail = Loadable(lazy(() => import('../pages/EP/RegistrationRequestDetailPage')))

export const PageCreateCourseTransferRequest = Loadable(lazy(() => import('../pages/EP/CreateCourseTransferRequestPage')));
export const PageCourseTransferRequestStatus = Loadable(lazy(() => import('../pages/EP/CourseTransferRequestStatusPage')));

// Search student
export const PageSearchStudent = Loadable(lazy(() => import('../pages/SearchStudentPage')));
export const PageSearchCourseStudent = Loadable(lazy(()=> import('../pages/SearchCourseStudentPage')));

// Search teacher
export const PageSearchTeacher = Loadable(lazy(() => import('../pages/SearchTeacherPage')));
export const PageSearchCourseTeacher = Loadable(lazy(() => import('../pages/SearchCourseTeacherPage')));

// EA ----------------------------------------------------------------------
// Daily calendar
export const PageDailyCalendar = Loadable(lazy(() => import('../pages/EA/DailyCalendarPage')));

// EA requests
export const PageRegistrationRequestEA = Loadable(lazy(() => import('../pages/EA/RegistrationRequestPage')));
export const PageScheduleRegistrationRequest = Loadable(lazy(() => import('../pages/EA/ScheduleRegistrationRequestPage')));
export const PageStudentRequestEA = Loadable(lazy(() => import('../pages/EA/StudentRequestPage')));
export const PageStaffRequestEA = Loadable(lazy(() => import('../pages/EA/StaffRequestPage')));

// OA ----------------------------------------------------------------------
// New Account
export const PageNewAccount = Loadable(lazy(() => import('../pages/OA/NewAccountPage')));
export const PageRegistrationRequestOA = Loadable(lazy(() => import('../pages/OA/RegistrationRequestPage')));
export const PageLeavingRequestOA = Loadable(lazy(() => import('../pages/OA/LeavingRequestPage')));
export const PageRegistrationRequestDetailOA = Loadable(lazy(() => import('../pages/OA/RegistrationRequestDetailPage')));
export const PageLeavingRequestDetailOA = Loadable(lazy(() => import('../pages/OA/LeavingRequestDetailPage')));



export const Page404 = Loadable(lazy(() => import('../pages/Page404')));

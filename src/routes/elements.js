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

// Student ----------------------------------------------------------------------
export const PageStudentCalendar = Loadable(lazy(() => import('../pages/Student/StudentCalendarPage')));
export const PageStudentCourse = Loadable(lazy(() => import('../pages/Student/StudentCoursePage')));
export const PageStudentProfile = Loadable(lazy(() => import('../pages/Student/StudentProfilePage')));
export const PageStudentRequestInbox = Loadable(lazy(() => import('../pages/Student/StudentRequestInboxPage')));
export const PageStudentRequestInboxDetail = Loadable(lazy(() => import('../pages/Student/StudentRequestInboxDetailPage')));
export const PageStudentPrivateCourseDetail = Loadable(lazy(() => import('../pages/Student/StudentPrivateCourseDetailPage')));
export const PageStudentGroupCourseDetail = Loadable(lazy(() => import('../pages/Student/StudentGroupCourseDetailPage')));
export const PageStudentMakeup = Loadable(lazy(() => import('../pages/Student/StudentMakeupPage')));
export const PageStudentMakeupRequest = Loadable(lazy(() => import('../pages/Student/StudentMakeupRequestPage')));


// Teacher ----------------------------------------------------------------------
export const PageTeacherCalendar = Loadable(lazy(() => import('../pages/Teacher/TeacherCalendarPage')));
export const PageTeacherCourse = Loadable(lazy(() => import('../pages/Teacher/TeacherCoursePage')));
export const PageTeacherLeavingRequest = Loadable(lazy(() => import('../pages/Teacher/TeacherLeavingRequestPage')));
export const PageTeacherRequestInbox = Loadable(lazy(() => import('../pages/Teacher/TeacherRequestInboxPage')));
export const PageTeacherRequestInboxDetail = Loadable(lazy(() => import('../pages/Teacher/TeacherRequestInboxDetailPage')));
export const PageTeacherPrivateCourseDetail = Loadable(lazy(() => import('../pages/Teacher/TeacherPrivateCourseDetailPage')));
export const PageTeacherGroupCourseDetail = Loadable(lazy(() => import('../pages/Teacher/TeacherGroupCourseDetailPage')));


export const Page404 = Loadable(lazy(() => import('../pages/Page404')));

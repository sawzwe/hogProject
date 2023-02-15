import { Navigate, useRoutes } from 'react-router-dom';
// auth
import RoleBasedGuard from '../auth/RoleBasedGuard';
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
import { useAuthContext } from '../auth/useAuthContext';
// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
//
import {
  Page404,
  LoginPage,
  RegisterPage,
  // EP
  PageNewStdent,
  PageSearchStudent,
  PageEditStudent,
  PageCreateRegistrationRequest,
  PageRegistrationRequestStatus,
  PageCourseTransferRequestStatus,
  PageCreateCourseTransferRequest,
  PageChangePassword,
  PageSearchCourseStudent,
  PageSearchTeacher,
  // EA
  PageDailyCalendar,
  PageRegistrationRequestEA,
  PageStudentRequestEA,
  PageStaffRequestEA,
  PageSearchCourseTeacher,
  PageRegistrationRequestDetail,
  PageScheduleRegistrationRequest,
  // OA
  PageNewAccount,
  PageRegistrationRequestOA,
  PageLeavingRequestOA,
  PageRegistrationRequestDetailOA,
  PageLeavingRequestDetailOA,
  // Student
  PageStudentCalendar,
  PageStudentCourse,
  PageStudentProfile,
  PageStudentRequestInbox,
  // Teacher
  PageTeacherCalendar,
  PageTeacherCourse,
  PageTeacherLeavingRequest,
  PageTeacherRequestInbox,
  PageStudentPrivateCourseDetail,
  PageStudentGroupCourseDetail
}
  from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  const { user } = useAuthContext();

  function firstPage() {
    if (user.role === 'Education Planner') {
      return 'new-student'
    }
    if (user.role === 'Education Admin') {
      return 'daily-calendar'
    }
    if (user.role === 'Office Admin') {
      return 'new-account'
    }
    if (user.role === 'Student') {
      return 'student-calendar'
    }
    if (user.role === 'Teacher') {
      return 'teacher-calendar'
    }
    return null;
  };

  return useRoutes([
    {
      path: '/',
      children: [
        { element: <Navigate to="/login" replace />, index: true },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          )
        }
      ],
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={user?.role && firstPage()} replace />, index: true },
        {
          path: 'new-student',
          element: (
            <RoleBasedGuard roles={['Education Planner']} hasContent>
              <PageNewStdent />
            </RoleBasedGuard>
          )
        },

        // Student search
        {
          path: 'student-management',
          children: [
            { element: <Navigate to={'/dashboard/student-management/search-student'} replace />, index: true },
            {
              path: 'search-student', element: (
                <RoleBasedGuard roles={['Education Planner', 'Education Admin']} hasContent>
                  <PageSearchStudent />
                </RoleBasedGuard>
              )
            },
            {
              path: 'search-student/:id/edit', element: (
                <RoleBasedGuard roles={['Education Planner', 'Education Admin']} hasContent>
                  <PageEditStudent />
                </RoleBasedGuard>
              )
            },
            {
              path: 'search-course', element: (
                <RoleBasedGuard roles={['Education Planner', 'Education Admin']} hasContent>
                  <PageSearchCourseStudent />
                </RoleBasedGuard>
              )
            },
          ]
        },

        // Teacher search for EA and OA ---------------------------------------------------------------
        {
          path: 'teacher-management',
          children: [
            { element: <Navigate to={'/dashboard/teacher-management/search-teacher'} replace />, index: true },
            {
              path: 'search-teacher', element: (
                <RoleBasedGuard roles={['Education Admin']} hasContent>
                  <PageSearchTeacher />
                </RoleBasedGuard>
              )
            },
            {
              path: 'search-course', element: (
                <RoleBasedGuard roles={['Education Admin']} hasContent>
                  <PageSearchCourseTeacher />
                </RoleBasedGuard>
              )
            },
            // {
            //   path: 'search-student/:id/edit', element: (
            //     <RoleBasedGuard roles={['Education Admin']} hasContent>
            //       <PageEditStudent />
            //     </RoleBasedGuard>
            //   )
            // },
            // {
            //   path: 'search-course', element: (
            //     <RoleBasedGuard roles={['Education Admin']} hasContent>
            //       <PageSearchStudentsCourses />
            //     </RoleBasedGuard>
            //   )
            // },
          ]
        },

        {
          path: 'course-registration',
          children: [
            { element: <Navigate to="/dashboard/course-registration/create-request" replace />, index: true },
            {
              path: 'create-request',
              element: (
                <RoleBasedGuard roles={['Education Planner']} hasContent>
                  <PageCreateRegistrationRequest />
                </RoleBasedGuard>
              )
            },
            {
              path: 'request-status',
              element: (
                <RoleBasedGuard roles={['Education Planner']} hasContent>
                  <PageRegistrationRequestStatus />
                </RoleBasedGuard>
              )
            },
            {
              path: 'request-status/:id',
              element: (
                <RoleBasedGuard roles={['Education Planner']} hasContent>
                  <PageRegistrationRequestDetail />
                </RoleBasedGuard>
              )
            }
          ]
        },
        {
          path: 'course-transfer',
          children: [
            { element: <Navigate to="/dashboard/course-transfer/request-status" replace />, index: true },
            {
              path: 'create-request',
              element: (
                <RoleBasedGuard roles={['Education Planner']} hasContent>
                  <PageCreateCourseTransferRequest />
                </RoleBasedGuard>
              )
            },
            {
              path: 'request-status',
              element: (
                <RoleBasedGuard roles={['Education Planner']} hasContent>
                  <PageCourseTransferRequestStatus />
                </RoleBasedGuard>
              )
            }
          ]
        },

        // EA Content ---------------------------------------------------------------
        {
          path: 'daily-calendar', element: (
            <RoleBasedGuard roles={['Education Admin']} hasContent>
              <PageDailyCalendar />
            </RoleBasedGuard>
          )
        },
        {
          path: 'registration-request', element: (
            <RoleBasedGuard roles={['Education Admin']} hasContent>
              <PageRegistrationRequestEA />
            </RoleBasedGuard>
          )
        },
        {
          path: 'registration-request/:id', element: (
            <RoleBasedGuard roles={['Education Admin']} hasContent>
              <PageScheduleRegistrationRequest />
            </RoleBasedGuard>
          )
        },

        // Course Transfer and Leaving Request
        {
          path: 'request-management',
          children: [
            { element: <Navigate to="/dashboard/request-management" replace />, index: true },
            {
              path: 'student-request',
              element: (
                <RoleBasedGuard roles={['Education Admin']} hasContent>
                  <PageStudentRequestEA />
                </RoleBasedGuard>
              )
            },
            {
              path: 'staff-request',
              element: (
                <RoleBasedGuard roles={['Education Admin']} hasContent>
                  <PageStaffRequestEA />
                </RoleBasedGuard>
              )
            }
          ]
        },

        // OA Content ---------------------------------------------------------------
        {
          path: 'new-account', element: (
            <RoleBasedGuard roles={['Office Admin']} hasContent>
              <PageNewAccount />
            </RoleBasedGuard>
          )
        },
        {
          path: 'edit-account',
          children: [
            { element: <Navigate to="/dashboard/edit-account" replace />, index: true },
            {
              path: 'student',
              element: (
                <RoleBasedGuard roles={['Office Admin']} hasContent>
                  <PageSearchStudent />
                </RoleBasedGuard>
              )
            },
            {
              path: 'teacher',
              element: (
                <RoleBasedGuard roles={['Office Admin']} hasContent>
                  <PageSearchTeacher />
                </RoleBasedGuard>
              )
            },
            {
              path: 'staff',
              element: (
                <RoleBasedGuard roles={['Office Admin']} hasContent>
                  <PageSearchTeacher />
                </RoleBasedGuard>
              )
            }
          ]
        },
        {
          path: 'registration-request-office-admin', element: (
            <RoleBasedGuard roles={['Office Admin']} hasContent>
              <PageRegistrationRequestOA />
            </RoleBasedGuard>
          )
        },
        {
          path: 'registration-request-office-admin/:id', element: (
            <RoleBasedGuard roles={['Office Admin']} hasContent>
              <PageRegistrationRequestDetailOA />
            </RoleBasedGuard>
          )
        },
        {
          path: 'leaving-request-office-admin', element: (
            <RoleBasedGuard roles={['Office Admin']} hasContent>
              <PageLeavingRequestOA />
            </RoleBasedGuard>
          )
        },
        {
          path: 'leaving-request-office-admin/:id', element: (
            <RoleBasedGuard roles={['Office Admin']} hasContent>
              <PageLeavingRequestDetailOA />
            </RoleBasedGuard>
          )
        },

        // Student Content ---------------------------------------------------------------
        {
          path: 'student-calendar', element: (
            <RoleBasedGuard roles={['Student']} hasContent>
              <PageStudentCalendar />
            </RoleBasedGuard>
          )
        },
        {
          path: 'student-course', element: (
            <RoleBasedGuard roles={['Student']} hasContent>
              <PageStudentCourse />
            </RoleBasedGuard>
          )
        },
        {
          path: 'student-profile', element: (
            <RoleBasedGuard roles={['Student']} hasContent>
              <PageStudentProfile />
            </RoleBasedGuard>
          )
        },
        {
          path: 'student-inbox', element: (
            <RoleBasedGuard roles={['Student']} hasContent>
              <PageStudentRequestInbox />
            </RoleBasedGuard>
          )
        },
        {
          path: 'student-course/private-course/:id', element: (
            <RoleBasedGuard roles={['Student']} hasContent>
              <PageStudentPrivateCourseDetail />
            </RoleBasedGuard>
          )
        },
        {
          path: 'student-course/group-course/:id', element: (
            <RoleBasedGuard roles={['Student']} hasContent>
              <PageStudentGroupCourseDetail />
            </RoleBasedGuard>
          )
        },

        // Teacher Content ---------------------------------------------------------------
        {
          path: 'teacher-calendar', element: (
            <RoleBasedGuard roles={['Teacher']} hasContent>
              <PageTeacherCalendar />
            </RoleBasedGuard>
          )
        },
        {
          path: 'teacher-course', element: (
            <RoleBasedGuard roles={['Teacher']} hasContent>
              <PageTeacherCourse />
            </RoleBasedGuard>
          )
        },
        {
          path: 'teacher-leaving-request', element: (
            <RoleBasedGuard roles={['Teacher']} hasContent>
              <PageTeacherLeavingRequest />
            </RoleBasedGuard>
          )
        },
        {
          path: 'teacher-inbox', element: (
            <RoleBasedGuard roles={['Teacher']} hasContent>
              <PageTeacherRequestInbox />
            </RoleBasedGuard>
          )
        },
        { path: 'changePassword', element: <PageChangePassword /> }
      ],
    },
    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

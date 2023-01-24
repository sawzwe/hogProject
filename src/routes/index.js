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
import { PATH_DASHBOARD, PATH_AUTH } from './paths';
//
import {
  Page404,
  PageNewStdent,
  LoginPage,
  RegisterPage,
  PageSearchStudent,
  PageEditStudent,
  PageCreateRegistrationRequest,
  PageRegistrationRequestStatus,
  PageCourseTransferRequestStatus,
  PageCreateCourseTransferRequest,
  PageChangePassword,
  PageSearchCourseStudent,
  PageSearchTeacher,
  PageDailyCalendar,
  PageRegistrationRequestEA,
  PageTransferringRequestEA,
  PageSearchCourseTeacher
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

        // Teacher search
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
        { path: 'daily-calendar', element: <PageDailyCalendar />},
        { path: 'registration-request', element: <PageRegistrationRequestEA />},
        { path: 'transferring-request', element: <PageTransferringRequestEA />},
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

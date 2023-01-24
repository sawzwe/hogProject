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
  PageAllStudents,
  PageEditStudent,
  PageCreateRequest,
  PageRequestStatus,
  PageCourseTransferRequest,
  PageChangePassword
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
      return 'search'
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
        {
          path: 'search',
          children: [
            {
              element: <RoleBasedGuard roles={['Education Planner', 'Education Admin', 'Office Admin']} hasContent>
                <PageAllStudents />
              </RoleBasedGuard>, index: true
            },
            { path: 'student/:studentId/edit', element: <PageEditStudent /> },
          ]
        },
        {
          path: 'create-registration-request',
          element: (
            <RoleBasedGuard roles={['Education Planner']} hasContent>
              <PageCreateRequest />
            </RoleBasedGuard>)
        },
        {
          path: 'registration-request-status',
          element: (
            <RoleBasedGuard roles={['Education Planner']} hasContent>
              <PageRequestStatus />
            </RoleBasedGuard>)
        },
        {
          path: 'course-transfer-request-status',
          element: (
            <RoleBasedGuard roles={['Education Planner']} hasContent>
              <PageCourseTransferRequest />
            </RoleBasedGuard>
          )
        },
        {
          path: 'create-course-transfer-request',
          element: (
            <RoleBasedGuard roles={['Education Planner']} hasContent>
              <PageCourseTransferRequest />
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

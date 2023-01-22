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
  PageOne,
  PageTwo,
  PageThree,
  RegisterPage,
  PageAllStdents,
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
      return 'newStudent'
    }
    if (user.role === 'Education Admin') {
      return 'allStudents'
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
          path: 'newStudent',
          element: (
            <RoleBasedGuard roles={['Education Planner']} hasContent>
              <PageNewStdent />
            </RoleBasedGuard>
          )
        },
        {
          path: 'allStudents',
          children: [
            {
              element: <RoleBasedGuard roles={['Education Planner', 'Education Admin', 'Office Admin']} hasContent>
                <PageAllStdents />
              </RoleBasedGuard>, index: true
            },
            { path: 'student/:id/edit', element: <PageEditStudent /> },
          ]
        },
        // {
        //   path: 'student/:id/edit',
        //   element: (
        //     <RoleBasedGuard roles={['Education Planner', 'Education Admin', 'Office Admin']} hasContent>
        //       <PageEditStudent />
        //     </RoleBasedGuard>
        //   )
        // },
        {
          path: 'createRequest',
          element: (
            <RoleBasedGuard roles={['Education Planner']} hasContent>
              <PageCreateRequest />
            </RoleBasedGuard>)
        },
        {
          path: 'requestStatus',
          element: (
            <RoleBasedGuard roles={['Education Planner']} hasContent>
              <PageRequestStatus />
            </RoleBasedGuard>)
        },
        {
          path: 'courseTransferRequest',
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

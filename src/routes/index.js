import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
import { useAuthContext } from '../auth/useAuthContext';
// layouts
import CompactLayout from '../layouts/compact';
import DashboardEPLayout from '../layouts/dashboardEP';
// 
import { PATH_DASHBOARD } from './paths';
//
import { Page404, PageNewStdent, PageTwo, PageSix, PageFour, PageFive, LoginPage, PageThree, RegisterPage, PageAllStdents, PageCreateRequest, PageRequestStatus, PageCourseTransferRequest, PageChangePassword } from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  const { user } = useAuthContext();
  
  // If user.role === 'Education Planner' then firstPage = PATH.DASHBOARD.newStudent;
  // Set condition at <Navigate  to={firstPage}> according to user's role
  return useRoutes([
    {
      path: '/',
      children: [
        { element: <Navigate to={PATH_DASHBOARD.newStudent} replace />, index: true },
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
          element: 
          <GuestGuard>
          <RegisterPage /> 
          </GuestGuard>
        }
      ],
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardEPLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_DASHBOARD.root} replace />, index: true },
        { path: 'newStudent', element: <PageNewStdent /> },
        { path: 'allStudents', element: <PageAllStdents /> },
        { path: 'createRequest', element: <PageCreateRequest /> },
        { path: 'requestStatus', element: <PageRequestStatus /> },
        { path: 'courseTransferRequest', element: <PageCourseTransferRequest /> },
        { path: 'resetPassword', element: <PageChangePassword />}
      ],
    },
    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

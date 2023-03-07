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
  // EP
  PageNewStdent,
  PageSearchStudent,
  PageViewStudent,
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
  PageTeacherLeaveDetailsEA,
  PageCourseTransferDetailsEA,
  // OA
  PageNewStaffAccount,
  PageRegistrationRequestOA,
  PageLeavingRequestOA,
  PageRegistrationRequestDetailOA,
  PageLeavingRequestDetailOA,
  PageStaffListOA,
  // Student
  PageStudentCalendar,
  PageStudentCourse,
  PageStudentProfile,
  PageStudentRequestInbox,
  PageStudentRequestInboxDetail,
  PageStudentPrivateCourseDetail,
  PageStudentGroupCourseDetail,
  PageStudentMakeup,
  PageStudentMakeupRequest,
  // Teacher
  PageTeacherCalendar,
  PageTeacherCourse,
  PageTeacherLeavingRequest,
  PageTeacherRequestInbox,
  PageTeacherRequestInboxDetail,
  PageTeacherPrivateCourseDetail,
  PageTeacherGroupCourseDetail,
  PageTeacherCheckGroupAttendance,
  PageTeacherCheckPrivateAttendance,
  ViewEditStudentCoursePage,
  PageEditTeacher,
  PageViewTeacher,
  PageViewStaff,
  PageEditStaff
}
  from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  const { user } = useAuthContext();

  function firstPage() {
    if (user.role === 'Education Planner') {
      return 'account/student-management/student'
    }
    if (user.role === 'Education Admin') {
      return 'daily-calendar'
    }
    if (user.role === 'Office Admin') {
      return 'new-staff'
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
      path: '/login',
      element: (
        <GuestGuard>
          <LoginPage />
        </GuestGuard>
      )
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={user?.role && firstPage()} replace />, index: true },
        // Account Path
        {
          path: 'account',
          children: [
            // Student Management -------------------------------------------------------------
            {
              path: 'student-management/student', element: (
                <RoleBasedGuard roles={['Education Planner', 'Education Admin', 'Office Admin']}>
                  <PageSearchStudent />
                </RoleBasedGuard>
              )
            },
            {
              path: 'student-management/student/:id', element: (
                <RoleBasedGuard roles={['Education Planner', 'Education Admin', 'Office Admin']} hasContent>
                  <PageViewStudent />
                </RoleBasedGuard>
              )
            },
            {
              path: 'student-management/student/:id/edit', element: (
                <RoleBasedGuard roles={['Education Planner', 'Education Admin', 'Office Admin']} hasContent>
                  <PageEditStudent />
                </RoleBasedGuard>
              )
            },
            {
              path: 'student-management/student-course', element: (
                <RoleBasedGuard roles={['Education Planner', 'Education Admin']} hasContent>
                  <PageSearchCourseStudent />
                </RoleBasedGuard>
              )
            },
            {
              path: 'student-management/student-course/:id', element: (
                <RoleBasedGuard roles={['Education Planner', 'Education Admin']} hasContent>
                  <ViewEditStudentCoursePage />
                </RoleBasedGuard>
              )
            },

            // Teacher Management --------------------------------------------------------------
            {
              path: 'teacher-management/teacher', element: (
                <RoleBasedGuard roles={['Education Admin', 'Office Admin']} hasContent>
                  <PageSearchTeacher />
                </RoleBasedGuard>
              )
            },
            {
              path: 'teacher-management/teacher/:id', element: (
                <RoleBasedGuard roles={['Education Admin', 'Office Admin']} hasContent>
                  <PageViewTeacher />
                </RoleBasedGuard>
              )
            },
            {
              path: 'teacher-management/teacher/:id/edit', element: (
                <RoleBasedGuard roles={['Education Admin', 'Office Admin']} hasContent>
                  <PageEditTeacher />
                </RoleBasedGuard>
              )
            },
            {
              path: 'teacher-management/teacher-course', element: (
                <RoleBasedGuard roles={['Education Admin']} hasContent>
                  <PageSearchCourseStudent />
                </RoleBasedGuard>
              )
            },
            {
              path: 'teacher-management/teacher-course/:id', element: (
                <RoleBasedGuard roles={['Education Admin']} hasContent>
                  <ViewEditStudentCoursePage />
                </RoleBasedGuard>
              )
            },

            // Staff Management --------------------------------------------------------------
            // {
            //   path: 'staff-management/staff', element: (
            //     <RoleBasedGuard roles={['Office Admin']} hasContent>
            // Add staff's table
            //     </RoleBasedGuard>
            //   )
            // },
            {
              path: 'staff-management/staff/:id', element: (
                <RoleBasedGuard roles={['Office Admin']} hasContent>
                  <PageViewStaff />
                </RoleBasedGuard>
              )
            },
            {
              path: 'staff-management/staff/:id/edit', element: (
                <RoleBasedGuard roles={['Office Admin']} hasContent>
                  <PageEditStaff />
                </RoleBasedGuard>
              )
            }
          ]
        },

        // EP Content --------------------------------------------------------------
        // EP New Student
        {
          path: 'new-student',
          element: (
            <RoleBasedGuard roles={['Education Planner']} hasContent>
              <PageNewStdent />
            </RoleBasedGuard>
          )
        },
        // EP Course registration
        {
          path: 'course-registration/create-request', element: (
            <RoleBasedGuard roles={['Education Planner']} hasContent>
              <PageCreateRegistrationRequest />
            </RoleBasedGuard>
          )
        },
        {
          path: 'course-registration/ep-request-status', element: (
            <RoleBasedGuard roles={['Education Planner', 'Education Admin']} hasContent>
              <PageRegistrationRequestStatus />
            </RoleBasedGuard>
          )
        },
        {
          path: 'course-registration/ep-request-status/:id',
          element: (
            <RoleBasedGuard roles={['Education Planner']} hasContent>
              <PageRegistrationRequestDetail />
            </RoleBasedGuard>
          )
        },
        // EP Course tranfer
        {
          path: 'course-transfer/create-request', element: (
            <RoleBasedGuard roles={['Education Planner']} hasContent>
              <PageCreateCourseTransferRequest />
            </RoleBasedGuard>
          )
        },
        {
          path: 'course-transfer/ep-request-status', element: (
            <RoleBasedGuard roles={['Education Planner']} hasContent>
              <PageCourseTransferRequestStatus />
            </RoleBasedGuard>
          )
        },

        // EA Content --------------------------------------------------------------
        // EA Daily Calendar
        {
          path: 'daily-calendar', element: (
            <RoleBasedGuard roles={['Education Admin']} hasContent>
              <PageDailyCalendar />
            </RoleBasedGuard>
          )
        },
        // EA Registration Request
        {
          path: 'course-registration/ea-request-status', element: (
            <RoleBasedGuard roles={['Education Admin']} hasContent>
              <PageRegistrationRequestEA />
            </RoleBasedGuard>
          )
        },
        {
          path: 'course-registration/ea-request-status/:id', element: (
            <RoleBasedGuard roles={['Education Admin']} hasContent>
              <PageScheduleRegistrationRequest />
            </RoleBasedGuard>
          )
        },
        // EA Student and Staff Request
        {
          path: 'schedule-changing/student-request', element: (
            <RoleBasedGuard roles={['Education Admin']} hasContent>
              <PageStudentRequestEA />
            </RoleBasedGuard>
          )
        },
        {
          path: 'schedule-changing/staff-request', element: (
            <RoleBasedGuard roles={['Education Admin']} hasContent>
              <PageStaffRequestEA />
            </RoleBasedGuard>
          )
        },
        {
          path: 'schedule-changing/staff-request/leaving-request/:id', element: (
            <RoleBasedGuard roles={['Education Admin']} hasContent>
              <  PageTeacherLeaveDetailsEA />
            </RoleBasedGuard>
          )
        },
        {
          path: 'schedule-changing/staff-request/course-transfer-request/:id', element: (
            <RoleBasedGuard roles={['Education Admin']} hasContent>
              <  PageCourseTransferDetailsEA />
            </RoleBasedGuard>
          )
        },

        // OA Content --------------------------------------------------------------
        {
          path: 'new-staff', element: (
            <RoleBasedGuard roles={['Office Admin']} hasContent>
              <PageNewStaffAccount />
            </RoleBasedGuard>
          )
        },
        {
          path: 'course-registration/oa-request-status', element: (
            <RoleBasedGuard roles={['Office Admin']} hasContent>
              <PageRegistrationRequestOA />
            </RoleBasedGuard>
          )
        },
        {
          path: 'course-registration/oa-request-status/:id', element: (
            <RoleBasedGuard roles={['Office Admin']} hasContent>
              <PageRegistrationRequestDetailOA />
            </RoleBasedGuard>
          )
        },
        {
          path: 'schedule-changing/leaving-request', element: (
            <RoleBasedGuard roles={['Office Admin']} hasContent>
              <PageLeavingRequestOA />
            </RoleBasedGuard>
          )
        },
        {
          path: 'schedule-changing/leaving-request/:id', element: (
            <RoleBasedGuard roles={['Office Admin']} hasContent>
              <PageLeavingRequestDetailOA />
            </RoleBasedGuard>
          )
        },
        {
          path: 'account/staff-management/staff', element: (
            <RoleBasedGuard roles={['Office Admin']} hasContent>
              <PageStaffListOA />
            </RoleBasedGuard>
          )
        },
        // Student Content --------------------------------------------------------------
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
          path: 'student-inbox/:id', element: (
            <RoleBasedGuard roles={['Student']} hasContent>
              <PageStudentRequestInboxDetail />
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
        {
          path: 'student-course/private-course/:courseId/makeup-class/:classId', element: (
            <RoleBasedGuard roles={['Student']} hasContent>
              <PageStudentMakeup />
            </RoleBasedGuard>
          )
        },
        {
          path: 'student-course/private-course/:courseId/makeup-class/:classId/request', element: (
            <RoleBasedGuard roles={['Student']} hasContent>
              <PageStudentMakeupRequest />
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
        {
          path: 'teacher-inbox/:id', element: (
            <RoleBasedGuard roles={['Teacher']} hasContent>
              <PageTeacherRequestInboxDetail />
            </RoleBasedGuard>
          )
        },
        {
          path: 'teacher-course/private-course/:courseId', element: (
            <RoleBasedGuard roles={['Teacher']} hasContent>
              <PageTeacherPrivateCourseDetail />
            </RoleBasedGuard>
          )
        },
        {
          path: 'teacher-course/group-course/:courseId', element: (
            <RoleBasedGuard roles={['Teacher']} hasContent>
              <PageTeacherGroupCourseDetail />
            </RoleBasedGuard>
          )
        },
        {
          path: 'teacher-course/private-course/:courseId/check-attendance/:classId', element: (
            <RoleBasedGuard roles={['Teacher']} hasContent>
              <PageTeacherCheckPrivateAttendance />
            </RoleBasedGuard>
          )
        },
        {
          path: 'teacher-course/group-course/:courseId/check-attendance/:classId', element: (
            <RoleBasedGuard roles={['Teacher']} hasContent>
              <PageTeacherCheckGroupAttendance />
            </RoleBasedGuard>
          )
        },
        { path: 'change-password', element: <PageChangePassword /> }
      ],
    },

    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

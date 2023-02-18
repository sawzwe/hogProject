export const currentTeacher = {
    fName: 'Zain',
    lName: 'Janpatiew',
    teacherPrivateClass: [
        {
            id: '0',
            course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
            classNo: '1',
            students: [{ id: '0', fullName: 'Michael John Bull' }],
            date: '13-Mar-2023',
            fromTime: '10:00',
            toTime: '12:00',
            room: '306',
            attendanceStatus: 'Complete',
            section: 'Michael John Bull',
            teacher: { id: '0', fullName: 'Zain Janpatiew' }
        },
        {
            id: '1',
            course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
            classNo: '2',
            students: [{ id: '0', fullName: 'Michael John Bull' }],
            date: '15-Mar-2023',
            fromTime: '10:00',
            toTime: '12:00',
            room: '306',
            attendanceStatus: 'Incomplete',
            section: 'Michael John Bull',
            teacher: { id: '0', fullName: 'Zain Janpatiew' }
        },
        {
            id: '2',
            course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
            classNo: '3',
            students: [{ id: '0', fullName: 'Michael John Bull' }],
            date: '17-Mar-2023',
            fromTime: '10:00',
            toTime: '12:00',
            room: '306',
            attendanceStatus: 'Complete',
            section: 'Michael John Bull',
            teacher: { id: '0', fullName: 'Zain Janpatiew' }
        },
        {
            id: '3',
            course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
            classNo: '4',
            students: [{ id: '0', fullName: 'Michael John Bull' }],
            date: '19-Mar-2023',
            fromTime: '10:00',
            toTime: '12:00',
            room: '',
            attendanceStatus: 'None',
            section: 'Michael John Bull',
            teacher: { id: '0', fullName: 'Zain Janpatiew' }
        },
        {
            id: '4',
            course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
            classNo: '5',
            students: [{ id: '0', fullName: 'Michael John Bull' }],
            date: '21-Mar-2023',
            fromTime: '10:00',
            toTime: '12:00',
            room: '',
            attendanceStatus: 'None',
            section: 'Michael John Bull',
            teacher: { id: '0', fullName: 'Zain Janpatiew' }
        },
        {
            id: '5',
            course: { id: '1', course: 'GED', subject: 'MATH', level: 'REGULAR', type: 'Semi Private' },
            classNo: '1',
            students: [{ id: '0', fullName: 'Michael John Bull' }, { id: '1', fullName: 'Piyaphon Wu' }],
            date: '14-Mar-2023',
            fromTime: '13:00',
            toTime: '15:00',
            room: '306',
            attendanceStatus: 'None',
            section: 'Kaphao Mookrob Group',
            teacher: { id: '0', fullName: 'Zain Janpatiew' }
        },
    ],
    teacherGroupClass: [
        {
            id: '0',
            course: { id: '0', course: 'SAT', subject: 'READING', level: 'INTENSIVE', type: 'Group' },
            classNo: '1',
            students: [{ id: '0', fullName: 'Michael John Bull' }, { id: '1', fullName: 'John Doe' }],
            date: '13-Mar-2023',
            fromTime: '14:00',
            toTime: '16:00',
            room: '101',
            attendanceStatus: 'None',
            section: 'CY/123',
            teacher: { id: '0', fullName: 'Zain Janpatiew' }
        }
    ],
    teacherPrivateCourse: [
        { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
        { id: '1', course: 'GED', subject: 'MATH', level: 'REGULAR', type: 'Semi Private' }
    ],
    teacherGroupCourse: [
        { id: '0', course: 'SAT', subject: 'READING', level: 'INTENSIVE', type: 'Group' }
    ],
    teacherLeaveRequest:[
        { id: '0', leaveType:'Sick Leave',       requestDate:'17-Feb-2022',fromDate:'18-Feb-2022',fromTime:"full day", toDate:'20-Feb-2022', toTime:"full day", durationDay:"2",durationHour:"-",status:'Pending',remark:"High-Blood Pressure"},
        { id: '1', leaveType:'Vacation Leave',   requestDate:'15-Feb-2022',fromDate:'17-Feb-2022',fromTime:"full day", toDate:'22-Feb-2022', toTime:"full day", durationDay:"5",durationHour:"-",status:'Complete',remark:"Annual Vacation Leave"},
        { id: '2', leaveType:'Vacation Leave',   requestDate:'19-Feb-2022',fromDate:'19-Feb-2022',fromTime:"full day", toDate:'21-Feb-2022', toTime:"full day", durationDay:"3",durationHour:"-",status:'Reject',remark:"Annual Vacation Leave"},
    ],
}
export const currentTeacher = {
    fName: 'Zain',
    lName: 'Janpatiew',
    teacherPrivateClass: [
        {
            id: '0',
            course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
            classNo: '1',
            students: [
                { id: '0', firstName: 'Michael', lastName: 'Bull', fullName: 'Michael Bull', nickname: 'Michael' }
            ],
            date: '13-Mar-2023',
            fromTime: '10:00',
            toTime: '12:00',
            room: '306',
            attendanceStatus: 'Complete',
            section: 'Michael Bull',
            teacher: { id: '0', fullName: 'Zain Janpatiew', nickname: 'Zain' },
            studentAttendance: [
                { student: { id: '0', firstName: 'Michael', lastName: 'Bull', fullName: 'Michael Bull', nickname: 'Michael' }, value: 'Present' }
            ]
        },
        {
            id: '1',
            course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
            classNo: '2',
            students: [
                { id: '0', firstName: 'Michael', lastName: 'Bull', fullName: 'Michael Bull', nickname: 'Michael' }
            ],
            date: '15-Mar-2023',
            fromTime: '10:00',
            toTime: '12:00',
            room: '306',
            attendanceStatus: 'Incomplete',
            section: 'Michael Bull',
            teacher: { id: '0', fullName: 'Zain Janpatiew', nickname: 'Zain' },
            studentAttendance: []
        },
        {
            id: '2',
            course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
            classNo: '3',
            students: [
                { id: '0', firstName: 'Michael', lastName: 'Bull', fullName: 'Michael Bull', nickname: 'Michael' }
            ],
            date: '17-Mar-2023',
            fromTime: '10:00',
            toTime: '12:00',
            room: '306',
            attendanceStatus: 'Complete',
            section: 'Michael Bull',
            teacher: { id: '0', fullName: 'Zain Janpatiew', nickname: 'Zain' },
            studentAttendance: [
                { student: { id: '0', firstName: 'Michael', lastName: 'Bull', fullName: 'Michael Bull', nickname: 'Michael' }, value: 'Present' }
            ]
        },
        {
            id: '3',
            course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
            classNo: '4',
            students: [
                { id: '0', firstName: 'Michael', lastName: 'Bull', fullName: 'Michael Bull', nickname: 'Michael' }
            ],
            date: '19-Mar-2023',
            fromTime: '10:00',
            toTime: '12:00',
            room: '306',
            attendanceStatus: 'None',
            section: 'Michael Bull',
            teacher: { id: '0', fullName: 'Zain Janpatiew', nickname: 'Zain' },
            studentAttendance: []
        },
        {
            id: '4',
            course: { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private' },
            classNo: '5',
            students: [
                { id: '0', firstName: 'Michael', lastName: 'Bull', fullName: 'Michael Bull', nickname: 'Michael' }]
            ,
            date: '21-Mar-2023',
            fromTime: '10:00',
            toTime: '12:00',
            room: '',
            attendanceStatus: 'None',
            section: 'Michael Bull',
            teacher: { id: '0', fullName: 'Zain Janpatiew', nickname: 'Zain' },
            studentAttendance: []
        },
        {
            id: '5',
            course: { id: '1', course: 'GED', subject: 'MATH', level: 'REGULAR', type: 'Semi Private' },
            classNo: '1',
            students: [
                { id: '0', firstName: 'Michael', lastName: 'Bull', fullName: 'Michael Bull', nickname: 'Michael' },
                { id: '1', firstName: 'Piyaphon', lastName: 'Wu', fullName: 'Piyaphon Wu', nickname: 'Hong' },
            ],
            date: '15-Mar-2023',
            fromTime: '13:00',
            toTime: '15:00',
            room: '306',
            attendanceStatus: 'Complete',
            section: 'Kaphao Mookrob Group',
            teacher: { id: '0', fullName: 'Zain Janpatiew', nickname: 'Zain' },
            studentAttendance: [
                { student: { id: '0', firstName: 'Michael', lastName: 'Bull', fullName: 'Michael Bull', nickname: 'Michael' }, value: 'Present' },
                { student: { id: '1', firstName: 'Piyaphon', lastName: 'Wu', fullName: 'Piyaphon Wu', nickname: 'Hong' }, value: 'Late' },
            ]
        },
        {
            id: '6',
            course: { id: '1', course: 'GED', subject: 'MATH', level: 'REGULAR', type: 'Semi Private' },
            classNo: '2',
            students: [
                { id: '0', firstName: 'Michael', lastName: 'Bull', fullName: 'Michael Bull', nickname: 'Michael' },
                { id: '1', firstName: 'Piyaphon', lastName: 'Wu', fullName: 'Piyaphon Wu', nickname: 'Hong' },
            ],
            date: '17-Mar-2023',
            fromTime: '13:00',
            toTime: '15:00',
            room: '306',
            attendanceStatus: 'None',
            section: 'Kaphao Mookrob Group',
            teacher: { id: '0', fullName: 'Zain Janpatiew', nickname: 'Zain' },
            studentAttendance: []
        },
    ],
    teacherGroupClass: [
        {
            id: '0',
            course: { id: '0', course: 'SAT', subject: 'READING', level: 'INTENSIVE', type: 'Group' },
            classNo: '1',
            students: [
                { id: '8', firstName: 'Piyaphon', lastName: 'Wu', fullName: 'Piyaphon Wu', nickname: 'Hong' },
                { id: '9', firstName: 'Piyaphon', lastName: 'Wu', fullName: 'Piyaphon Wu', nickname: 'Hong' },
                { id: '10', firstName: 'Piyaphon', lastName: 'Wu', fullName: 'Piyaphon Wu', nickname: 'Hong' },
                { id: '11', firstName: 'Piyaphon', lastName: 'Wu', fullName: 'Piyaphon Wu', nickname: 'Hong' },
                { id: '12', firstName: 'Piyaphon', lastName: 'Wu', fullName: 'Piyaphon Wu', nickname: 'Hong' },
                { id: '13', firstName: 'Piyaphon', lastName: 'Wu', fullName: 'Piyaphon Wu', nickname: 'Hong' },
                { id: '14', firstName: 'Piyaphon', lastName: 'Wu', fullName: 'Piyaphon Wu', nickname: 'Hong' },
                { id: '15', firstName: 'Piyaphon', lastName: 'Wu', fullName: 'Piyaphon Wu', nickname: 'Hong' }
            ],
            date: '13-Mar-2023',
            fromTime: '14:00',
            toTime: '16:00',
            room: '101',
            attendanceStatus: 'Incomplete',
            section: 'CY/123',
            teacher: { id: '0', fullName: 'Zain Janpatiew', nickname: 'Zain' },
            studentAttendance: []
        }
    ],
    teacherPrivateCourse: [
        { id: '0', course: 'SAT', subject: 'MATH', level: 'INTENSIVE', type: 'Private', section: 'Michael Bull' },
        { id: '1', course: 'GED', subject: 'MATH', level: 'REGULAR', type: 'Semi Private', section: 'Kaphao Mookrob Group' },
    ],
    teacherGroupCourse: [
        { id: '0', course: 'SAT', subject: 'READING', level: 'INTENSIVE', type: 'Group', section: 'CY/123' },
    ],
}
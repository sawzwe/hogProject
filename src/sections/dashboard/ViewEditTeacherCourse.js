import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { m } from 'framer-motion';
import _ from 'lodash';
import { useNavigate } from 'react-router';
import Moment from 'moment';
import { extendMoment } from "moment-range";
// form
import { useForm, Controller } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import {
    Fade,
    TextField,
    Grid,
    Stack,
    Card,
    Box,
    Dialog,
    Paper,
    Typography,
    Button,
    IconButton,
    MenuItem,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    InputAdornment,
    Container,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import EventNoteIcon from '@mui/icons-material/EventNote';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// utils
import { fDate } from '../../utils/formatTime'
// components
import { MotionContainer, varBounce } from '../../components/animate';
import { useSnackbar } from '../../components/snackbar';
import Scrollbar from '../../components/scrollbar/Scrollbar';
import FormProvider, { RHFSelect } from '../../components/hook-form';
// assets
import { UploadIllustration } from '../../assets/illustrations';
//
import { AddClassDialog } from './AddClassDialog';
import { EditClassDialog } from './EditClassDialog';
import { ViewCourseDialog } from './ViewCourseDialog';
import { HOG_API } from '../../config';
import { useAuthContext } from '../../auth/useAuthContext';
import { ClassPaper } from './ClassPaper';
import { ViewEditScheduleDialog } from './ViewEditScheduleDialog';

// ----------------------------------------------------------------

ViewEditTeacherCourse.propTypes = {
    currentTeacher: PropTypes.object,
    currentCourses: PropTypes.array,
    pendingCourses: PropTypes.array
}

export default function ViewEditTeacherCourse({ currentTeacher, currentCourses, pendingCourses }) {

    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const allCourses = [...currentCourses, ...pendingCourses]

    const {
        role
    } = user;


    const [selectedCourse, setSelectedCourse] = useState({});
    const [selectedRequest, setSelectedRequest] = useState({})
    const [selectedSchedules, setSelectedSchedules] = useState([]);

    const [openViewEditSchedule, setOpenViewEditSchedule] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [deleteCourseId, setDeleteCourseId] = useState()
    const [deleteCourseName, setDeleteCourseName] = useState()
    // const [openViewCourseDialog, setOpenViewCourseDialog] = useState(false);

    const handleSelect = async (course) => {
        const currentCourse = allCourses.find((eachCourse) => eachCourse.course.id === course.id).course
        const currentRequest = allCourses.find((eachCourse) => eachCourse.course.id === course.id).request
        const currentSchedules = allCourses.find((eachCourse) => eachCourse.course.id === course.id).classes
        await setSelectedCourse(currentCourse)
        await setSelectedRequest(currentRequest)
        await setSelectedSchedules(currentSchedules)

        setOpenViewEditSchedule(true);
    }

    const handleClickDelete = async (course) => {
        setDeleteCourseId(course.id)
        setDeleteCourseName(`${(course.course)} ${(course.subject)} ${(course.level)} (${course.section})`)
        setOpenDeleteDialog(true)
    }

    const handleCloseDelete = () => {
        setDeleteCourseId()
        setOpenDeleteDialog(false)
    }

    const handleDeleteCourse = async () => {
        try {
            await axios.delete(`${HOG_API}/api/Schedule/Delete/${deleteCourseId}`)
                .catch((error) => {
                    throw error
                })
            navigate(0)
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
        }
    }

    if (allCourses.length === 0) {
        return (
            <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
                <m.div variants={varBounce().in}>
                    <Typography variant="h3" paragraph>
                        No courses
                    </Typography>
                </m.div>

                <m.div variants={varBounce().in}>
                    <Typography sx={{ color: 'text.secondary' }}>Student has not registered for any courses yet</Typography>
                </m.div>

                <m.div variants={varBounce().in}>
                    <UploadIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
                </m.div>
            </Container>
        )
    }

    return (
        <>
            <Grid container spacing={3}>
                {currentCourses.length > 0 && (
                    <Grid item xs={12} md={12}>
                        <Typography variant="h6">
                            Registered Course
                        </Typography>
                    </Grid>
                )}

                {currentCourses.length > 0 && (
                    <Grid item xs={12} md={12}>
                        <Stack direction="column" spacing={2}>
                            {currentCourses.map((eachCourse) => (
                                <ClassPaper
                                    key={eachCourse.course.id}
                                    _course={eachCourse.course}
                                    _request={eachCourse.request}
                                    onSelect={handleSelect}
                                    onDelete={handleClickDelete}
                                    role={role}
                                />
                            ))}
                        </Stack>
                    </Grid>
                )}

                {pendingCourses.length > 0 && (
                    <Grid item xs={12} md={12}>
                        {currentCourses.length > 0 && <Divider />}
                        <Typography variant="h6" sx={{ mt: currentCourses.length > 0 ? 2 : 0 }}>
                            Pending Course
                        </Typography>
                    </Grid>
                )}

                <Grid item xs={12} md={12}>
                    <Stack direction="column" spacing={2}>
                        {pendingCourses.map((eachCourse) => (
                            <ClassPaper
                                key={eachCourse.course.id}
                                _course={eachCourse.course}
                                _request={eachCourse.request}
                                onSelect={handleSelect}
                                onDelete={handleClickDelete}
                                role={role}
                                pending
                            />
                        ))}
                    </Stack>
                </Grid>
            </Grid>
            {
                Object.keys(selectedRequest).length !== 0 && (
                    <ViewEditScheduleDialog
                        open={openViewEditSchedule}
                        onClose={() => setOpenViewEditSchedule(false)}
                        selectedCourse={selectedCourse}
                        selectedSchedules={selectedSchedules}
                        selectedRequest={selectedRequest}
                        role={role}
                    />
                )
            }
        </>
    )
}


// // // ----------------------------------------------------------------

// ViewEditScheduleDialog.propTypes = {
//     selectedCourse: PropTypes.object,
//     selectedSchedules: PropTypes.array,
//     selectedRequest: PropTypes.object,
//     open: PropTypes.bool,
//     onClose: PropTypes.func,
//     role: PropTypes.string
// }

// export function ViewEditScheduleDialog({ selectedCourse, selectedSchedules, selectedRequest, open, onClose, role }) {

//     const { enqueueSnackbar } = useSnackbar();
//     const moment = extendMoment(Moment);
//     const navigate = useNavigate();

//     const {
//         preferredDay
//     } = selectedCourse;

//     const {
//         courseType
//     } = selectedRequest;

//     const [schedules, setSchedules] = useState([]);
//     const [selectedClass, setSelectedClass] = useState({})
//     const [selectedStudents, setSelectedStudents] = useState([])
//     const [openEditClassDialog, setOpenEditClassDialog] = useState(false);

//     const handleOpenEditDialog = (row) => {
//         const formattedRow = {
//             date: new Date(row.date),
//             fromTime: row.fromTime,
//             toTime: row.toTime,
//             teacher: { id: '' },
//             method: _.capitalize(row.method),
//             id: row.id
//         }

//         setSelectedStudents(row.studentPrivateClasses)
//         setSelectedClass(formattedRow);
//         setOpenEditClassDialog(true);
//     }

//     const handleCloseEditClassDialog = () => {
//         setSelectedClass({});
//         setOpenEditClassDialog(false);
//     }

//     let displayAccumulatedHours = 0;

//     function accumulatedHours() {
//         let HoursCount = 0;
//         schedules.forEach((eachSchedule) => {
//             const timeA = moment([eachSchedule.fromTime.slice(0, 2), eachSchedule.fromTime.slice(3, 5)], "HH:mm")
//             const timeB = moment([eachSchedule.toTime.slice(0, 2), eachSchedule.toTime.slice(3, 5)], "HH:mm")
//             HoursCount += timeB.diff(timeA, 'hours');
//         })
//         return HoursCount;
//     }

//     useEffect(() => {
//         setSchedules(selectedSchedules);
//     }, [selectedSchedules])

//     // const handleAddClass = (newClass) => {
//     //     const newSchedule = [...currentSchedule, newClass];
//     //     setCurrentSchedule(newSchedule.sort((class1, class2) => new Date(class1.date).getTime() - new Date(class2.date).getTime()));
//     // };

//     // const handleEditClass = (classIndex, newClass) => {
//     //     const newSchedule = [...currentSchedule];
//     //     newSchedule[classIndex] = newClass;
//     //     setCurrentSchedule(newSchedule.sort((class1, class2) => new Date(class1.date).getTime() - new Date(class2.date).getTime()));
//     // }

//     const handleEditClass = async (newClass) => {

//         let hasConflict = false;

//         const filteredSchedules = schedules.filter((eachSchedule) => eachSchedule.id !== newClass.id)

//         await filteredSchedules.forEach((eachClass) => {

//             // Calculate overlapping time
//             const timeAStart = moment([eachClass.fromTime.slice(0, 2), eachClass.fromTime.slice(3, 5)], "HH:mm")
//             const timeAEnd = moment([eachClass.toTime.slice(0, 2), eachClass.toTime.slice(3, 5)], "HH:mm")

//             const timeBStart = moment([newClass.fromTime.slice(0, 2), newClass.fromTime.slice(3, 5)], "HH:mm");
//             const timeBEnd = moment([newClass.toTime.slice(0, 2), newClass.toTime.slice(3, 5)], "HH:mm");

//             const range1 = moment.range(timeAStart, timeAEnd);
//             const range2 = moment.range(timeBStart, timeBEnd);

//             if (new Date(eachClass.date).getTime() === newClass.date.getTime() && range1.overlaps(range2)) {
//                 hasConflict = true;
//             }
//         })

//         if (!hasConflict) {

//             const previousData = schedules.find((eachClass) => eachClass.id === newClass.id)

//             const formattedData = {
//                 id: newClass.id,
//                 room: previousData.room,
//                 method: newClass.method,
//                 date: fDate(newClass.date, 'dd-MMM-yyyy'),
//                 fromTime: newClass.fromTime,
//                 toTime: newClass.toTime,
//                 studentPrivateClasses: previousData.studentPrivateClasses,
//                 teacherPrivateClass: {
//                     id: previousData.teacherPrivateClass.id,
//                     teacherId: newClass.teacher.id,
//                     workType: newClass.teacher.workType,
//                     status: previousData.teacherPrivateClass.status
//                 }
//             }

//             // console.log(formattedData)
//             try {
//                 await axios.put(`${HOG_API}/api/Schedule/Put`, formattedData)
//                     // .then((res) => console.log(res))
//                     .catch((error) => {
//                         throw error
//                     })
//             } catch (error) {
//                 console.error(error)
//                 enqueueSnackbar(error.message, { variant: 'error' })
//             }
//         } else {
//             enqueueSnackbar('Selected time overlaps with existing schedules', { variant: 'error' });
//         }
//     }

//     // console.log('schedules', schedules)

//     const handleDeleteClass = (deletedClass) => {
//         const filteredSchedules = schedules.filter((eachSchedule) => eachSchedule !== deletedClass)
//         setSchedules(filteredSchedules.sort((class1, class2) => class1.date - class2.date));
//     }

//     // const handleDeleteClass = (classIndex) => {
//     //     const newSchedule = [...currentSchedule];
//     //     newSchedule.splice(classIndex, 1);
//     //     setCurrentSchedule(newSchedule.sort((class1, class2) => new Date(class1.date).getTime() - new Date(class2.date).getTime()));
//     // }

//     // const handleSaveChange = () => {
//     //     const totalHour = calculateTotalHour(currentSchedule);
//     //     if (totalHour !== parseInt(selectedCourse.totalHour, 10)) {
//     //         return enqueueSnackbar(`Total hours is invalid. Must be ${selectedCourse.totalHour} hours`, { variant: 'error' });
//     //     }
//     //     console.log(currentSchedule);
//     //     // If schedule is not changed once saved then we must reload the page
//     //     // navigate(0);
//     //     onClose();
//     //     return enqueueSnackbar('Schedule saved', { variant: 'success' });

//     // };

//     const calculateTotalHour = (schedule) => {
//         let HoursCount = 0;
//         schedule.forEach((eachSchedule) => {
//             const timeA = moment([eachSchedule.fromTime.slice(0, 2), eachSchedule.fromTime.slice(3, 5)], "HH:mm")
//             const timeB = moment([eachSchedule.toTime.slice(0, 2), eachSchedule.toTime.slice(3, 5)], "HH:mm")
//             HoursCount += timeB.diff(timeA, 'hours');
//         })
//         return HoursCount;
//     };

//     const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//     // Tables ---------------------------------------------------------------------------------
//     const StyledTableCell = styled(TableCell)(({ theme }) => ({
//         [`&.${tableCellClasses.head}`]: {
//             backgroundColor: theme.palette.divider,
//             color: theme.palette.common.black,
//             fontSize: '0.7rem',
//             border: `1px solid ${theme.palette.divider}`,
//         },
//         [`&.${tableCellClasses.body}`]: {
//             fontSize: '0.7rem',
//             padding: (role === 'Education Admin' ? 5 : 16),
//             border: `1px solid ${theme.palette.divider}`,

//         },
//     }));

//     const StyledTableRow = styled(TableRow)(({ theme }) => ({
//         '&:last-child td, &:last-child th': {
//             backgroundColor: theme.palette.divider,
//             padding: 16,
//             fontWeight: 600,
//             border: `1px solid ${theme.palette.divider}`,
//         },
//     }));

//     const customTextFieldStyle = {
//         fontSize: '0.9rem'
//     }

//     // console.log('schedules', schedules);
//     // console.log(role)

//     return (
//         <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>

//             <Grid container direction="row" sx={{ p: 3, pb: 1 }} spacing={2} >
//                 <Grid container item xs={12} md={12} justifyContent="space-between" alignItems="center">
//                     <Typography variant="h6"> Edit Class </Typography>
//                     <IconButton variant="h6" onClick={onClose}> <CloseIcon /> </IconButton>
//                 </Grid>
//             </Grid>

//             <Grid container direction="row" sx={{ px: 3 }} spacing={2}>
//                 <Grid item xs={12} md={5}>
//                     <Grid item xs={12} md={12} sx={{ pb: 2 }}>
//                         <Typography variant="h6"> Course Information </Typography>
//                     </Grid>

//                     <Stack direction="row" sx={{ pb: 2 }}>
//                         <Grid container direction="row" spacing={2}>
//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     value={selectedCourse.course.concat(' ', selectedCourse.subject, ' ', selectedCourse.level)}
//                                     label="Course"
//                                     disabled
//                                     InputProps={{
//                                         style: customTextFieldStyle
//                                     }}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     value={courseType.toUpperCase()}
//                                     label="Course Type"
//                                     disabled
//                                     InputProps={{
//                                         style: customTextFieldStyle
//                                     }}
//                                 />
//                             </Grid>
//                         </Grid>
//                     </Stack>

//                     <Stack direction="row" sx={{ pb: 2 }}>
//                         <Grid container direction="row" spacing={2}>
//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     value={_.capitalize(selectedCourse.method)}
//                                     label="Learning Method"
//                                     disabled
//                                     inputProps={{
//                                         style: { textTransform: "capitalize", fontSize: "0.9rem" }
//                                     }}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={3}>
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     value={selectedCourse.totalHour}
//                                     label="Total Hours"
//                                     disabled
//                                     InputProps={{
//                                         style: customTextFieldStyle
//                                     }}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={3}>
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     value={selectedCourse.hourPerClass}
//                                     label="Hours/Class"
//                                     disabled
//                                     InputProps={{
//                                         style: customTextFieldStyle
//                                     }}
//                                 />
//                             </Grid>
//                         </Grid>
//                     </Stack>

//                     <Stack direction="row" sx={{ pb: 2 }} spacing={2}>
//                         <Grid container direction="row" spacing={2}>
//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     value={fDate(selectedCourse.fromDate, 'dd-MMM-yyyy')}
//                                     label="Start Date"
//                                     disabled
//                                     InputProps={{
//                                         style: customTextFieldStyle
//                                     }}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={6}>
//                                 <TextField
//                                     fullWidth
//                                     variant="outlined"
//                                     value={fDate(selectedCourse.toDate, 'dd-MMM-yyyy')}
//                                     label="End Date"
//                                     disabled
//                                     InputProps={{
//                                         style: customTextFieldStyle
//                                     }}
//                                 />
//                             </Grid>
//                         </Grid>
//                     </Stack>
//                 </Grid>

//                 <Grid item xs={12} md={7}>
//                     <Scrollbar sx={{ maxHeight: '28.1rem', pr: 1.5 }}>
//                         <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
//                             <Typography variant="h6">
//                                 Classes & Schedules
//                             </Typography>

//                             {/* <Button variant="text" color="primary" onClick={() => setOpenAddClassDialog(true)}>
//                                 <AddIcon sx={{ mr: 0.5 }} /> Add Class
//                             </Button> */}

//                         </Stack>
//                         {schedules.length > 0 && (
//                             <TableContainer component={Paper} >
//                                 <Table sx={{ width: '100%' }}>
//                                     <TableHead>
//                                         <TableRow>
//                                             <StyledTableCell align="center">No.</StyledTableCell>
//                                             <StyledTableCell align="center">Day</StyledTableCell>
//                                             <StyledTableCell align="center">Date</StyledTableCell>
//                                             <StyledTableCell colSpan={2} align="center">Time</StyledTableCell>
//                                             <StyledTableCell align="center">Method</StyledTableCell>
//                                             <StyledTableCell align="center">Teacher</StyledTableCell>
//                                             <StyledTableCell align="center">Hours</StyledTableCell>
//                                             {role === 'Education Admin' && (
//                                                 <StyledTableCell align="center" />
//                                             )}
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {schedules.map((eachClass, index) => {
//                                             const timeA = moment([eachClass.fromTime.slice(0, 2), eachClass.fromTime.slice(3, 5)], "HH:mm")
//                                             const timeB = moment([eachClass.toTime.slice(0, 2), eachClass.toTime.slice(3, 5)], "HH:mm")
//                                             const hourPerClass = timeB.diff(timeA, 'hours')
//                                             displayAccumulatedHours += hourPerClass;
//                                             const classDate = new Date(eachClass.date);
//                                             return (
//                                                 <StyledTableRow key={index}>
//                                                     <StyledTableCell component="th" scope="row" align="center">
//                                                         {(index + 1).toString()}
//                                                     </StyledTableCell>
//                                                     <StyledTableCell align="center"> {weekday[classDate.getDay()].slice(0, 3)} </StyledTableCell>
//                                                     <StyledTableCell align="center">{fDate(classDate, 'dd-MMM-yyyy')}</StyledTableCell>
//                                                     <StyledTableCell align="center">{eachClass.fromTime} - {eachClass.toTime}</StyledTableCell>
//                                                     <StyledTableCell sx={{ width: '8%' }} align="center">{hourPerClass.toString()}</StyledTableCell>
//                                                     <StyledTableCell align="center">{_.capitalize(eachClass.method)}</StyledTableCell>
//                                                     <StyledTableCell sx={{ width: '15%' }} align="center">{eachClass.teacherPrivateClass.nickname}</StyledTableCell>
//                                                     <StyledTableCell align="center">{displayAccumulatedHours.toString()}</StyledTableCell>
//                                                     {role === 'Education Admin' && (
//                                                         <StyledTableCell align="center">
//                                                             <IconButton onClick={() => handleOpenEditDialog(eachClass, index)}>
//                                                                 <EditIcon fontSize="small" />
//                                                             </IconButton>
//                                                         </StyledTableCell>
//                                                     )}
//                                                 </StyledTableRow>
//                                             )
//                                         })}
//                                         <StyledTableRow>
//                                             <StyledTableCell colSpan={7} align="center">TOTAL</StyledTableCell>
//                                             <StyledTableCell align="center">{accumulatedHours()}</StyledTableCell>
//                                             {role === 'Education Admin' && (
//                                                 <StyledTableCell align="center" />
//                                             )}
//                                         </StyledTableRow>
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                         )}
//                     </Scrollbar>
//                 </Grid>
//             </Grid>

//             {role === 'Education Admin' ? (
//                 <DialogActions>
//                     <Button variant="outlined" color="inherit" onClick={onClose}>Cancel</Button>
//                     {/* <Button variant="contained" color="primary" onClick={handleSaveChange}>Save Changes</Button> */}
//                 </DialogActions>
//             ) : (
//                 <DialogActions>
//                     <Button variant="outlined" color="inherit" onClick={onClose}>Close</Button>
//                 </DialogActions>
//             )}

//             {/* <AddClassDialog
//                 open={openAddClassDialog}
//                 onClose={() => setOpenAddClassDialog(false)}
//                 onAdd={onAdd}
//             /> */}

//             {Object.keys(selectedClass).length > 0 && (
//                 <EditClassDialog
//                     open={openEditClassDialog}
//                     close={handleCloseEditClassDialog}
//                     schedule={selectedClass}
//                     students={selectedStudents}
//                     hourPerClass={selectedCourse.hourPerClass}
//                     onEdit={handleEditClass}
//                     onDelete={handleDeleteClass}
//                     courseCustom
//                 />
//             )}

//         </Dialog>
//     )
// }
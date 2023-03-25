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

    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const handleCloseViewEditDialog = () => {
        setSelectedCourse({})
        setSelectedRequest({})
        setSelectedSchedules({})
        setOpenViewEditSchedule(false)
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
        setIsSubmitting(true)
        try {
            await axios.put(`${HOG_API}/api/Schedule/SoftDelete/${deleteCourseId}`)
                .catch((error) => {
                    throw error
                })
            setIsSubmitting(false)
            navigate(0)
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
            setIsSubmitting(false)
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
                    <Typography sx={{ color: 'text.secondary' }}>Teacher has not been assigned for any courses yet</Typography>
                </m.div>

                <m.div variants={varBounce().in}>
                    <UploadIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
                </m.div>
            </Container>
        )
    }

    // console.log("HI")

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
                Object.keys(selectedRequest).length !== 0 && selectedSchedules.length > 0 && (
                    <ViewEditScheduleDialog
                        open={openViewEditSchedule}
                        onClose={handleCloseViewEditDialog}
                        selectedCourse={selectedCourse}
                        selectedSchedules={selectedSchedules}
                        selectedRequest={selectedRequest}
                        students={selectedSchedules[0].studentPrivateClasses}
                        role={role}
                    />
                )
            }

            {
                deleteCourseName !== undefined && (
                    <Dialog fullWidth maxWidth="sm" open={openDeleteDialog} onClose={handleCloseDelete}>
                        <DialogTitle>Delete Course?</DialogTitle>
                        <DialogContent>
                            {`Once deleted, ${deleteCourseName} will be removed from the system.`}
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined" color="inherit" onClick={handleCloseDelete}>Cancel</Button>
                            <LoadingButton variant="contained" color="error" loading={isSubmitting} onClick={handleDeleteCourse}>Delete</LoadingButton>
                        </DialogActions>
                    </Dialog>
                )
            }
        </>
    )
}
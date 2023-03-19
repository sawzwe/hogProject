import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import axios from 'axios';
import { useNavigate } from 'react-router';
// form
import { useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import {
    Typography,
    MenuItem,
    Grid,
    Stack,
    Card,
    Box,
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    IconButton,
    TextField,
    InputAdornment,
    Divider,
    ListItem
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSelect, RHFUpload, RHFTextField, RHFRadioGroup, RHFCheckbox } from '../../../components/hook-form';
import StudentCard from './add-student/StudentCard';
import CourseCard from './add-course/CourseCard';
import Iconify from '../../../components/iconify';
import SearchNotFound from '../../../components/search-not-found/SearchNotFound';
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import { AddStudentForm, AddCourseForm } from '.';
import { privateCourses } from './_mockupData';
// utils
import { fDate } from '../../../utils/formatTime';
//
import { HOG_API } from '../../../config';


// ----------------------------------------------------------------------

const COURSE_TYPE_OPTIONS = [
    'Private', 'Semi Private'
];

const PAYMENT_TYPE_OPTIONS = [
    { value: 'Complete Payment', label: 'Complete Payment' },
    { value: 'Installments Payment', label: 'Installments Payment' }
];

const MAX_STUDENTS_PER_REQUEST = 1;

const MAX_STUDENTS_PER_REQUEST_SEMI_PRIVATE = 15;

// ----------------------------------------------------------------------

NewViewRegistrationRequest.propTypes = {
    isView: PropTypes.bool,
    studentList: PropTypes.array,
    educationPlannerId: PropTypes.number,
};

// ----------------------------------------------------------------------

export default function NewViewRegistrationRequest({ studentList, educationPlannerId }) {

    const [courseType, setCourseType] = useState('');

    const handleChangeCourseType = (event) => {
        setCourseType(event.target.value);
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid container item xs={12} md={5}>
                    <FormControl fullWidth>
                        <InputLabel>Course Type</InputLabel>
                        <Select
                            fullWidth
                            value={courseType}
                            label="Course Type"
                            native={false}
                            inputProps={{ sx: { textTransform: 'capitalize' } }}
                            onChange={handleChangeCourseType}
                        >
                            {COURSE_TYPE_OPTIONS.map((option) => (
                                <MenuItem
                                    key={option}
                                    value={option}
                                    sx={{
                                        mx: 1,
                                        my: 0.5,
                                        borderRadius: 0.75,
                                        typography: 'body2',
                                        textTransform: 'capitalize',
                                        '&:first-of-type': { mt: 0 },
                                        '&:last-of-type': { mb: 0 },
                                    }}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* <Grid container item xs={12} md={5}>
                {courseType === 'Semi Private' && (
                    <RHFTextField
                        name="section"
                        label="Section"
                        required
                    />
                )}
            </Grid> */}

            {courseType === 'Semi Private' && (
                <NewSemiPrivateRequestForm studentList={studentList} educationPlannerId={educationPlannerId} />
            )}

            {courseType === 'Private' && (
                <NewPrivateRequestForm studentList={studentList} educationPlannerId={educationPlannerId} />
            )}

        </>



        // <Dialog
        //     open={submitDialogOpen}
        //     onClose={handleSubmitClose}
        //     aria-labelledby="alert-dialog-title"
        //     aria-describedby="alert-dialog-description"
        // >
        //     <DialogTitle id="alert-dialog-title">
        //         <Stack direction="row" alignItems="center" justifyContent="flex-start">
        //             <CheckCircleOutlineIcon fontSize="large" sx={{ mr: 1 }} />
        //             <Typography variant="h5">{"Submit this request?"}</Typography>
        //         </Stack>
        //     </DialogTitle>
        //     <DialogContent>
        //         <DialogContentText id="alert-dialog-description">
        //             {courseType === 'Group' ?
        //                 'If you submit, this request will be sent to Office Admin for payment checking.' :
        //                 'If you submit, this request will be sent to Education Admin for scheduling.'
        //             }
        //         </DialogContentText>
        //     </DialogContent>
        //     <DialogActions>
        //         <Button color="inherit" variant="outlined" onClick={handleSubmitClose}>Cancel</Button>
        //         <Button variant="contained" onClick={handleSubmit(onSubmit)} autoFocus>
        //             Submit
        //         </Button>
        //     </DialogActions>
        // </Dialog>
    )
}

// ----------------------------------------------------------------------

NewPrivateRequestForm.propTypes = {
    studentList: PropTypes.array,
    educationPlannerId: PropTypes.number
}

export function NewPrivateRequestForm({ studentList, educationPlannerId }) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const NewRequestSchema = Yup.object().shape({
        courseType: Yup.string().required('Course type is required'),
        selectedStudent: Yup.array().min(1, "At least one student is required").required('At least one student is required'),
        courses: Yup.array().min(1, "At least one course is required").required('At least one course is required'),
        additionalComment: Yup.string(),
    });

    const defaultValues = {
        courseType: 'Private',
        selectedStudent: [],
        courses: [],
        additionalComment: '',
    };

    const methods = useForm({
        resolver: yupResolver(NewRequestSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        setError,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const { courseType, students, courses, selectedStudent } = values

    const handleAddStudent = (newStudent) => {
        if (selectedStudent.length > 0) {
            enqueueSnackbar('Number of student exceeds!', { variant: 'error' })
        } else {
            setValue('selectedStudent', [...selectedStudent, newStudent]);
        }
    };

    const handleRemoveStudent = (studentId) => {
        const newSelectedStudent = selectedStudent.filter((student) => student.studentId !== studentId);
        setValue('selectedStudent', newSelectedStudent);
    };

    const handleAddCourse = (newCourse) => {
        setValue('courses', [...courses, newCourse])
    };

    const handleRemoveCourse = (courseIndex) => {
        const tempCourses = courses
        tempCourses.splice(courseIndex, 1)
        setValue('courses', tempCourses);
    };

    const [openEditCourseDialog, setOpenEditCourseDialog] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState({});
    const [selectedCourseIndex, setSelectedCourseIndex] = useState();

    const handleClickEditCourse = (courseIndex) => {
        setSelectedCourseIndex(courseIndex);
        setSelectedCourse(courses[courseIndex]);
        setOpenEditCourseDialog(true);
    };

    const handleEditCourse = (data, index) => {
        const tempCourses = courses;
        tempCourses[index] = data;
        setValue('courses', tempCourses);
    };

    const handleCloseEditCourseDialog = () => {
        setSelectedCourse({});
        setSelectedCourseIndex();
        setOpenEditCourseDialog(false);
    };

    const onSubmit = async (data) => {
        try {
            // Clean up the data
            const {
                selectedStudent,
                courses,
                additionalComment
            } = data;

            if (selectedStudent.length === 0) {
                enqueueSnackbar('At least one student must be selected', { variant: 'error' })
            }

            if (courses.length === 0) {
                enqueueSnackbar('At least one course must be created', { variant: 'error' })
            }

            const studentIds = selectedStudent.map((student) => student.id);

            const request = {
                courseType: 'Private',
                section: selectedStudent[0].nickname,
                status: 'PendingEA',
                eaStatus: "InProgress",
                paymentStatus: "None",
                epRemark1: additionalComment,
                takenByEPId: educationPlannerId,
            }

            const information = courses.map((eachCourse) => {
                const section = selectedStudent[0].nickname
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                const allPreferredDays = [eachCourse.monday, eachCourse.tuesday, eachCourse.wednesday, eachCourse.thursday, eachCourse.friday, eachCourse.saturday, eachCourse.sunday]
                allPreferredDays.forEach((eachDay, index) => { eachDay.day = days[index] })
                const filteredPerferredDays = allPreferredDays.filter((eachDay) => eachDay.isSelected)
                return {
                    course: eachCourse.course,
                    subject: eachCourse.subject,
                    level: eachCourse.level,
                    totalHour: eachCourse.totalHour,
                    method: eachCourse.method,
                    hourPerClass: eachCourse.hourPerClass,
                    fromDate: fDate(eachCourse.fromDate, 'dd-MMM-yyyy'),
                    toDate: fDate(eachCourse.toDate, 'dd-MMM-yyyy'),
                    preferredDays: filteredPerferredDays.map((eachDay) => eachDay.isSelected && { day: eachDay.day, fromTime: eachDay.fromTime, toTime: eachDay.toTime })
                }
            })

            await axios.post(`${HOG_API}/api/PrivateRegistrationRequest/Post`, {
                studentIds,
                request,
                information,
            })
                .catch((error) => {
                    throw error;
                })

            enqueueSnackbar('The request is successfully created', { variant: 'success' })
            navigate('/course-registration/ep-request-status')

        } catch (error) {
            console.log(error)
            enqueueSnackbar(error.message, { variant: 'error' })
        }
    }

    const onError = (error) => {
        console.log(error)
        const errors = Object.values(error)
        enqueueSnackbar(errors[0].message, { variant: 'error' })
    }

    return (
        <>
            <FormProvider methods={methods}>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={12}>
                        <AddStudentCard
                            courseType="Private"
                            onAdd={handleAddStudent}
                            onRemove={handleRemoveStudent}
                            selectedStudent={selectedStudent}
                            studentList={studentList}
                        />
                    </Grid>

                    {/* Add Course */}
                    <Grid item xs={12} md={12}>
                        <AddCourseCard
                            onAdd={handleAddCourse}
                            onEdit={handleClickEditCourse}
                            onRemove={handleRemoveCourse}
                            createdCourse={courses}
                        />
                    </Grid>

                    {/* Additional Comment */}
                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h5"
                                sx={{
                                    mb: 2,
                                    display: 'block',
                                }}>Additional Comment</Typography>
                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(1, 1fr)',
                                }}
                            >
                                <RHFTextField name="additionalComment" label="Comment to Education Admin" />
                            </Box>
                        </Card>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12} md={12}>
                        <Stack direction="row" justifyContent="flex-end" alignItems="center">
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                                onClick={handleSubmit(onSubmit, onError)}
                                sx={{ height: '3em' }}
                            >
                                Send request
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
            </FormProvider>

            {Object.keys(selectedCourse).length > 0 && (
                <AddCourseDialog
                    open={openEditCourseDialog}
                    onClose={handleCloseEditCourseDialog}
                    onEdit={handleEditCourse}
                    isEdit
                    selectedCourse={selectedCourse}
                    selectedCourseIndex={selectedCourseIndex}
                />
            )}
        </>
    )
}

// ----------------------------------------------------------------------

NewSemiPrivateRequestForm.propTypes = {
    studentList: PropTypes.array,
    educationPlannerId: PropTypes.number
}

export function NewSemiPrivateRequestForm({ studentList, educationPlannerId }) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const NewRequestSchema = Yup.object().shape({
        courseType: Yup.string().required('Course type is required'),
        section: Yup.string().required('Section name is required'),
        selectedStudent: Yup.array().min(1, "At least one student is required").required('At least one student is required'),
        courses: Yup.array().min(1, "At least one course is required").required('At least one course is required'),
        additionalComment: Yup.string(),
    });

    const defaultValues = {
        courseType: 'Semi Private',
        selectedStudent: [],
        section: '',
        courses: [],
        additionalComment: '',
    };

    const methods = useForm({
        resolver: yupResolver(NewRequestSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        setError,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const { courseType, students, courses, selectedStudent } = values

    const handleAddStudent = (newStudent) => {
        if (selectedStudent.length > 14) {
            enqueueSnackbar('Number of student exceeds!', { variant: 'error' })
        } else {
            setValue('selectedStudent', [...selectedStudent, newStudent]);
        }
    };

    const handleRemoveStudent = (studentId) => {
        const newSelectedStudent = selectedStudent.filter((student) => student.studentId !== studentId);
        setValue('selectedStudent', newSelectedStudent);
    };

    const handleAddCourse = (newCourse) => {
        setValue('courses', [...courses, newCourse])
    };

    const handleRemoveCourse = (courseIndex) => {
        const tempCourses = courses
        tempCourses.splice(courseIndex, 1)
        setValue('courses', tempCourses);
    };

    const [openEditCourseDialog, setOpenEditCourseDialog] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState({});
    const [selectedCourseIndex, setSelectedCourseIndex] = useState();

    const handleClickEditCourse = (courseIndex) => {
        setSelectedCourseIndex(courseIndex);
        setSelectedCourse(courses[courseIndex]);
        setOpenEditCourseDialog(true);
    };

    const handleEditCourse = (data, index) => {
        const tempCourses = courses;
        tempCourses[index] = data;
        setValue('courses', tempCourses);
    };

    const handleCloseEditCourseDialog = () => {
        setSelectedCourse({});
        setSelectedCourseIndex();
        setOpenEditCourseDialog(false);
    };

    const onSubmit = async (data) => {
        try {
            // Clean up the data
            const {
                selectedStudent,
                section,
                courses,
                additionalComment
            } = data;

            if (selectedStudent.length === 0) {
                enqueueSnackbar('At least one student must be selected', { variant: 'error' })
            }

            if (courses.length === 0) {
                enqueueSnackbar('At least one course must be created', { variant: 'error' })
            }

            const studentIds = selectedStudent.map((student) => student.id);

            const request = {
                courseType: 'Semi Private',
                section,
                status: 'PendingEA',
                eaStatus: "InProgress",
                paymentStatus: "None",
                epRemark1: additionalComment,
                takenByEPId: educationPlannerId,
            }

            const information = courses.map((eachCourse) => {
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                const allPreferredDays = [eachCourse.monday, eachCourse.tuesday, eachCourse.wednesday, eachCourse.thursday, eachCourse.friday, eachCourse.saturday, eachCourse.sunday]
                allPreferredDays.forEach((eachDay, index) => { eachDay.day = days[index] })
                const filteredPerferredDays = allPreferredDays.filter((eachDay) => eachDay.isSelected)
                return {
                    course: eachCourse.course,
                    subject: eachCourse.subject,
                    level: eachCourse.level,
                    totalHour: eachCourse.totalHour,
                    method: eachCourse.method,
                    hourPerClass: eachCourse.hourPerClass,
                    fromDate: fDate(eachCourse.fromDate, 'dd-MMM-yyyy'),
                    toDate: fDate(eachCourse.toDate, 'dd-MMM-yyyy'),
                    preferredDays: filteredPerferredDays.map((eachDay) => eachDay.isSelected && { day: eachDay.day, fromTime: eachDay.fromTime, toTime: eachDay.toTime })
                }
            })

            await axios.post(`${HOG_API}/api/PrivateRegistrationRequest/Post`, {
                studentIds,
                request,
                information,
            })
                .catch((error) => {
                    throw error;
                })

            enqueueSnackbar('The request is successfully created', { variant: 'success' })
            navigate('/course-registration/ep-request-status')

        } catch (error) {
            console.log(error)
            enqueueSnackbar(error.message, { variant: 'error' })
        }
    }

    const onError = (error) => {
        console.log(error)
        const errors = Object.values(error)
        enqueueSnackbar(errors[0].message, { variant: 'error' })
    }

    return (
        <>
            <FormProvider methods={methods}>
                <Grid container spacing={3} sx={{ mt: 1 }}>

                    <Grid item xs={12} md={5}>
                        <RHFTextField fullWidth label="Section name" name="section" required />
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <AddStudentCard
                            courseType="Semi Private"
                            onAdd={handleAddStudent}
                            onRemove={handleRemoveStudent}
                            selectedStudent={selectedStudent}
                            studentList={studentList}
                        />
                    </Grid>

                    {/* Add Course */}
                    <Grid item xs={12} md={12}>
                        <AddCourseCard
                            onAdd={handleAddCourse}
                            onEdit={handleClickEditCourse}
                            onRemove={handleRemoveCourse}
                            createdCourse={courses}
                        />
                    </Grid>

                    {/* Additional Comment */}
                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h5"
                                sx={{
                                    mb: 2,
                                    display: 'block',
                                }}>Additional Comment</Typography>
                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(1, 1fr)',
                                }}
                            >
                                <RHFTextField name="additionalComment" label="Comment to Education Admin" />
                            </Box>
                        </Card>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12} md={12}>
                        <Stack direction="row" justifyContent="flex-end" alignItems="center">
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                                onClick={handleSubmit(onSubmit, onError)}
                                sx={{ height: '3em' }}
                            >
                                Send request
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
            </FormProvider>

            {Object.keys(selectedCourse).length > 0 && (
                <AddCourseDialog
                    open={openEditCourseDialog}
                    onClose={handleCloseEditCourseDialog}
                    onEdit={handleEditCourse}
                    isEdit
                    selectedCourse={selectedCourse}
                    selectedCourseIndex={selectedCourseIndex}
                />
            )}
        </>
    )
}

// ----------------------------------------------------------------------

AddStudentCard.propTypes = {
    studentList: PropTypes.array,
    selectedStudent: PropTypes.array,
    courseType: PropTypes.string,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
}

export function AddStudentCard({ studentList, courseType, selectedStudent, onAdd, onRemove }) {

    const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);

    const limitStudent = () => (courseType === 'Private' ? 1 : 15)

    return (
        <Card sx={{ p: 3 }}>
            <Grid
                container
                direction="row"
                alignItems="center">
                <Grid item xs={6} md={6}>
                    <Typography variant="h6">{`Student(s) ${selectedStudent?.length} / ${courseType === 'Private' ? '1' : '15'}`}</Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                    <Stack direction="row" justifyContent="flex-end">
                        {selectedStudent.length < limitStudent() && (
                            <Button variant="outlined" size='large' onClick={() => setOpenAddStudentDialog(true)}>
                                <AddIcon /> {courseType === 'Private' ? 'Select Student' : 'Add Student'}
                            </Button>
                        )}
                    </Stack>
                </Grid>
            </Grid>

            <AddStudentDialog
                open={openAddStudentDialog}
                onClose={() => setOpenAddStudentDialog(false)}
                limit={limitStudent()}
                onAdd={onAdd}
                studentOptions={studentList}
                selectedStudent={selectedStudent}
            />

            <Grid container direction="row">
                {selectedStudent?.map((student) => (
                    <Grid item xs={12} md={5} key={student.studentId}>
                        <StudentCard
                            key={student.studentId}
                            student={student}
                            onRemove={onRemove}
                        />
                    </Grid>
                ))}
            </Grid>

        </Card>
    )
}

// ----------------------------------------------------------------------

AddStudentDialog.propTypes = {
    open: PropTypes.bool,
    limit: PropTypes.number,
    onClose: PropTypes.func,
    onAdd: PropTypes.func,
    studentOptions: PropTypes.array,
    selectedStudent: PropTypes.array,
};

export function AddStudentDialog({ open, limit, onClose, onAdd, studentOptions, selectedStudent }) {

    const [searchStudent, setSearchStudent] = useState('');
    const dataFiltered = applyFilter(studentOptions, searchStudent);
    const isNotFound = !dataFiltered.length && !!searchStudent;

    const handleSearchStudent = (event) => {
        setSearchStudent(event.target.value);
    };

    const handleAddStudent = (student) => {
        onAdd(student);
        setSearchStudent('');
        onClose();
    };

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
                <Typography variant="h6"> Select student </Typography>
                <IconButton variant="h6" onClick={onClose}> <CloseIcon /> </IconButton>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ p: 2.5 }}>
                <TextField
                    fullWidth
                    value={searchStudent}
                    onChange={handleSearchStudent}
                    placeholder="Search..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            {isNotFound ? (
                <SearchNotFound query={searchStudent} sx={{ px: 3, pt: 5, pb: 10 }} />
            ) : (
                <Scrollbar sx={{ p: 3, pt: 0, pb: 4, maxHeight: 80 * 8 }}>
                    {dataFiltered.map((student) =>
                    (!selectedStudent?.some((s) => s.id === student.id) &&
                        <Box key={student.studentId}>
                            <ListItem
                                key={student.studentId}
                                secondaryAction={
                                    <Button variant="outlined" onClick={() => handleAddStudent(student)}> Add </Button>
                                }
                                alignItems="flex-start"
                                sx={{
                                    p: 1,
                                    mb: 1,
                                    mt: 1,
                                    borderRadius: 1,
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    '&.Mui-selected': {
                                        bgcolor: 'action.selected',
                                        '&:hover': {
                                            bgcolor: 'action.selected',
                                        },
                                    },
                                }}
                            >

                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="subtitle2">
                                    {student.studentId} - {student.fName} {student.lName} ({student.nickname})
                                </Typography>
                            </ListItem>
                            <Divider />
                        </Box>
                    )
                    )
                    }
                </Scrollbar>
            )
            }
        </Dialog>
    )
}

// ----------------------------------------------------------------------

function applyFilter(array, query) {
    if (query) {
        return array.filter(
            (student) =>
                student.studentId.indexOf(query) !== -1 ||
                student.fName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
                student.lName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
                student.nickname.toLowerCase().indexOf(query.toLowerCase()) !== -1
        )
    }

    return array;
}

// ----------------------------------------------------------------------

AddCourseCard.propTypes = {
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    onEdit: PropTypes.func,
    createdCourse: PropTypes.array,
};

export function AddCourseCard({ onAdd, onRemove, onEdit, createdCourse }) {

    const [openAddCourseDialog, setOpenAddCourseDialog] = useState(false);

    return (
        <Card sx={{ p: 3 }}>
            <Grid container
                direction="row"
                alignItems="center">
                <Grid item xs={6} md={6}>
                    <Typography variant="h6">{`New Course(s)`}</Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                    <Stack direction="row" justifyContent="flex-end">
                        <Button variant="outlined" size='large' onClick={() => setOpenAddCourseDialog(true)}>
                            {<AddIcon />} New Course
                        </Button>
                    </Stack>
                </Grid>
                <AddCourseDialog
                    open={openAddCourseDialog}
                    onClose={() => setOpenAddCourseDialog(false)}
                    onAdd={onAdd}
                />
            </Grid>

            {createdCourse?.map((course, index) =>
                <CourseCard key={index} courseIndex={index} courseInfo={course} onRemove={onRemove} onEdit={onEdit} />
            )}
        </Card>
    )
}

// ----------------------------------------------------------------

AddCourseDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func,
    isEdit: PropTypes.bool,
    selectedCourse: PropTypes.object,
    selectedCourseIndex: PropTypes.number,
}

export function AddCourseDialog({ open, onClose, onAdd, onEdit, isEdit, selectedCourse, selectedCourseIndex }) {

    const { enqueueSnackbar } = useSnackbar();

    const today = new Date();
    const [privateSubjects, setPrivateSubjects] = useState([]);
    const [privateLevels, setPrivateLevels] = useState([]);

    const defaultValues = {
        newCourseType: selectedCourse?.newCourseType || 'Existing Course',
        course: selectedCourse?.course || '',
        subject: selectedCourse?.subject || '',
        level: selectedCourse?.level || '',
        totalHour: selectedCourse?.totalHour || '',
        hourPerClass: selectedCourse?.hourPerClass || '',
        method: selectedCourse?.method || '',
        fromDate: selectedCourse?.fromDate || today,
        toDate: selectedCourse?.toDate || null,
        monday: selectedCourse?.monday || { isSelected: false, fromTime: '', toTime: '' },
        tuesday: selectedCourse?.tuesday || { isSelected: false, fromTime: '', toTime: '' },
        wednesday: selectedCourse?.wednesday || { isSelected: false, fromTime: '', toTime: '' },
        thursday: selectedCourse?.thursday || { isSelected: false, fromTime: '', toTime: '' },
        friday: selectedCourse?.friday || { isSelected: false, fromTime: '', toTime: '' },
        saturday: selectedCourse?.saturday || { isSelected: false, fromTime: '', toTime: '' },
        sunday: selectedCourse?.sunday || { isSelected: false, fromTime: '', toTime: '' }
    };

    const NewCourseSchema = Yup.object().shape({
        newCourseType: Yup.string().required('At least one type must be selected'),
        course: Yup.string().required('Course name is required'),
        subject: Yup.string()
            .test(
                'isRequired',
                'Subject is required',
                (value, context) => ((privateSubjects.length === 0 && value === '') ||
                    (privateSubjects.length > 0 && value !== '') ||
                    (context.parent.newCourseType === 'Custom Course')),
            ),
        level: Yup.string()
            .test(
                'isRequired',
                'Level is required',
                (value, context) => ((privateLevels.length === 0 && value === '') ||
                    (privateLevels.length > 0 && value !== '') ||
                    (context.parent.newCourseType === 'Custom Course')),
            ),
        totalHour: Yup.number().typeError('Total hours must be number').min(1, 'Total hours must be greater than 0').required('Total hours is required'),
        hourPerClass: Yup.number().typeError('Hours per class must be number')
            .max(3, 'Maximum hours/class is 3 hours')
            .required('Hours per class is required')
            .test(
                'maxTotalHour',
                'Hours/Class must be less than total hours',
                (value, context) => (value <= parseFloat(context.parent.totalHour)),
            )
            .test(
                'divisible',
                'Total hours must be divisible by hours/class',
                (value, context) => (parseFloat(context.parent.totalHour) % value === 0),
            ),
        method: Yup.string().required('Learning method is required'),
        fromDate: Yup.string().required('Start date is required'),
        toDate: Yup.string().required('End date is required'),
        monday: Yup.object().shape({
            fromTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                }),
            toTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                })
        }),
        tuesday: Yup.object().shape({
            fromTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                }),
            toTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                })
        }),
        wednesday: Yup.object().shape({
            fromTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                }),
            toTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                })
        }),
        thursday: Yup.object().shape({
            fromTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                }),
            toTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                })
        }),
        friday: Yup.object().shape({
            fromTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                }),
            toTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                })
        }),
        saturday: Yup.object().shape({
            fromTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                }),
            toTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                })
        }),
        sunday: Yup.object().shape({
            fromTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                }),
            toTime: Yup.string()
                .when('isSelected', {
                    is: true,
                    then: Yup.string().required('')
                })
        }),
        preferredDaySlot: Yup.string()
            .when(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], {
                is: (monday, tuesday, wednesday, thursday, friday, saturday, sunday) => !monday.isSelected && !tuesday.isSelected && !wednesday.isSelected && !thursday.isSelected && !friday.isSelected && !saturday.isSelected && !sunday.isSelected,
                then: Yup.string().required("At least one preferred day is required"),
                otherwise: Yup.string()
            })
    });


    const methods = useForm({
        resolver: yupResolver(NewCourseSchema),
        defaultValues,
    });

    const {
        setError,
        watch,
        reset,
        resetField,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const {
        newCourseType,
        course,
        subject,
        level,
        totalHour,
        hourPerClass,
        method,
        fromDate,
        toDate,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday
    } = values;

    const LEARNING_METHOD_OPTIONS = [
        'Onsite',
        'Online'
    ];

    const COURSE_OPTIONS = privateCourses;

    const COURSE_TYPE_OPTIONS = [
        { value: 'Existing Course', label: 'Existing Course' },
        { value: 'Custom Course', label: 'Custom Course' },
    ];

    useEffect(() => {
        if (isEdit && newCourseType === 'Existing Course') {
            const targetCourse = COURSE_OPTIONS.find((option) => option.course === course)
            setPrivateSubjects(targetCourse.subjects)
            setPrivateLevels(targetCourse.level)
            setValue('subject', selectedCourse.subject)
            setValue('level', selectedCourse.level)
        } else if (isEdit && newCourseType === 'Custom Course') {
            setValue('subject', selectedCourse.subject)
            setValue('level', selectedCourse.level)
        }
    }, [])

    const handleChangeCourseType = (event) => {
        reset(defaultValues);
        setValue('course', '');
        setValue('subject', '');
        setValue('level', '');
        setValue('newCourseType', event.target.value);
        setPrivateSubjects([]);
        setPrivateLevels([]);
    };

    const handleChangeCourse = (event) => {
        setValue('course', event.target.value);
        setValue('subject', '')
        setValue('level', '')

        const targetCourse = COURSE_OPTIONS.find((option) => option.course === event.target.value)
        // if (!targetCourse.subjects.length) {
        //     setValue('subject', '-')
        // }
        // if (!targetCourse.level.length) {
        //     setValue('level', '-')
        // }
        setPrivateSubjects(targetCourse.subjects)
        setPrivateLevels(targetCourse.level)
    }

    const handleChangeStartDate = (event) => {
        setValue('fromDate', event.target.value);
        setValue('toDate', '');
    }

    const onSubmitCourse = async (data) => {
        try {
            if (isEdit) {
                onEdit(data, selectedCourseIndex);
                reset(defaultValues);
                onClose();
            } else {
                onAdd(data);
                reset(defaultValues);
                onClose();
            }
        } catch (error) {
            console.error(error);
            reset();
        }
    }

    const onErrorCourse = (error) => {
        const errors = Object.values(error)
        enqueueSnackbar(errors[0].message, { variant: 'error' })
        // if (error.preferredDaySlot) {
        //     return enqueueSnackbar("At least one perferred day is required!", { variant: 'error' });
        // }
        // if (error.totalHour) {
        //     if (error.totalHour.type === 'min') {
        //         return enqueueSnackbar(error.totalHour.message, { variant: 'error' });
        //     }
        // }
        // if (error.hourPerClass) {
        //     if (error.hourPerClass.type === 'max') {
        //         return enqueueSnackbar(error.hourPerClass.message, { variant: 'error' });
        //     }

        //     if (error.hourPerClass.type === 'maxTotalHour') {
        //         return enqueueSnackbar(error.hourPerClass.message, { variant: 'error' });
        //     }

        //     if (error.hourPerClass.type === 'divisible') {
        //         return enqueueSnackbar(error.hourPerClass.message, { variant: 'error' });
        //     }
        // }
        // return enqueueSnackbar(error.message, { variant: 'error' });
    };

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}
            PaperProps={{
                sx: {
                    '&::-webkit-scrollbar': { display: 'none' }
                }
            }} >

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitCourse, onErrorCourse)}>
                <Grid container direction="row" sx={{ p: 3, pb: 0 }} spacing={2} >
                    <Grid container item xs={12} md={12} justifyContent="space-between">
                        <Typography variant="h6"> New Course </Typography>
                        <IconButton variant="h6" onClick={onClose}> <CloseIcon /> </IconButton>
                    </Grid>
                </Grid>

                <Grid container direction="row" sx={{ px: 1 }} spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Stack direction="row" sx={{ mb: 2, mx: 3 }}>
                            <Grid container direction="row" spacing={2}>
                                {/* Radio Group Button */}
                                <Grid item xs={12} md={12}>
                                    <RHFRadioGroup
                                        name="newCourseType"
                                        options={COURSE_TYPE_OPTIONS}
                                        sx={{
                                            '& .MuiFormControlLabel-root': { mr: 4 },
                                        }}
                                        onChange={(event) => handleChangeCourseType(event)}
                                    />
                                </Grid>
                            </Grid>
                        </Stack>

                        <Stack direction="row" sx={{ mb: 2, mx: 3 }}>
                            <Grid container spacing={2}>

                                {newCourseType === 'Existing Course' ? (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <RHFSelect
                                                name="course"
                                                label="Course"
                                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                                onChange={(event) => handleChangeCourse(event)}
                                                required>
                                                {COURSE_OPTIONS.map((option) => (
                                                    <MenuItem
                                                        key={option.id}
                                                        value={option.course}
                                                        sx={{
                                                            mx: 1,
                                                            my: 0.5,
                                                            borderRadius: 0.75,
                                                            typography: 'body2',
                                                            textTransform: 'capitalize',
                                                            '&:first-of-type': { mt: 0 },
                                                            '&:last-of-type': { mb: 0 },
                                                        }}
                                                    >
                                                        {option.course}
                                                    </MenuItem>
                                                ))}
                                            </RHFSelect>
                                        </Grid>

                                        {/* Select Subject */}
                                        <Grid item xs={12} md={6}>
                                            {privateSubjects.length > 0 ? (
                                                <RHFSelect
                                                    name="subject"
                                                    label="Subject"
                                                    disabled={!course}
                                                    SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                                    required>
                                                    {privateSubjects.map((option) => (
                                                        <MenuItem
                                                            key={option}
                                                            value={option}
                                                            sx={{
                                                                mx: 1,
                                                                my: 0.5,
                                                                borderRadius: 0.75,
                                                                typography: 'body2',
                                                                textTransform: 'capitalize',
                                                                '&:first-of-type': { mt: 0 },
                                                                '&:last-of-type': { mb: 0 },
                                                            }}
                                                        >
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </RHFSelect>
                                            ) : (
                                                <TextField fullWidth defaultValue="" label="Subject" disabled />
                                            )}

                                        </Grid>

                                        {/* Select Level */}
                                        <Grid item xs={12} md={6}>
                                            {privateLevels.length > 0 ? (
                                                <RHFSelect
                                                    name="level"
                                                    label="Level"
                                                    disabled={!course}
                                                    SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                                    required>
                                                    {privateLevels.map((option) => (
                                                        <MenuItem
                                                            key={option}
                                                            value={option}
                                                            sx={{
                                                                mx: 1,
                                                                my: 0.5,
                                                                borderRadius: 0.75,
                                                                typography: 'body2',
                                                                textTransform: 'capitalize',
                                                                '&:first-of-type': { mt: 0 },
                                                                '&:last-of-type': { mb: 0 },
                                                            }}
                                                        >
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </RHFSelect>
                                            ) : (
                                                <TextField fullWidth defaultValue="" label="Level" disabled />
                                            )}
                                        </Grid>
                                    </>
                                ) :
                                    <>
                                        {/* Custom Course */}
                                        <Grid item xs={6} md={6}>
                                            <RHFTextField name="course" label="Course" required />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <RHFTextField name="subject" label="Subject" />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <RHFTextField name="level" label="Level" />
                                        </Grid>
                                    </>
                                }

                                {/* Total Hours */}
                                <Grid item xs={6} md={2}>
                                    <RHFTextField isNumber inputProps={{ maxLength: 2 }} error={false} helperText="" name="totalHour" label="Total Hours" required />
                                </Grid>

                                {/* Learning Method */}
                                <Grid item xs={6} md={2}>
                                    <RHFSelect
                                        name="method"
                                        label="Method"
                                        SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                        required>
                                        {LEARNING_METHOD_OPTIONS.map((option) => (
                                            <MenuItem
                                                key={option}
                                                value={option}
                                                sx={{
                                                    mx: 1,
                                                    my: 0.5,
                                                    borderRadius: 0.75,
                                                    typography: 'body2',
                                                    textTransform: 'capitalize',
                                                    '&:first-of-type': { mt: 0 },
                                                    '&:last-of-type': { mb: 0 },
                                                }}
                                            >
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </RHFSelect>
                                </Grid>

                                {/* Hours Per Class */}
                                <Grid item xs={6} md={2}>
                                    <RHFTextField isNumber inputProps={{ maxLength: 1 }} error={false} helperText="" name="hourPerClass" label="Hours/Class" required />
                                </Grid>
                            </Grid>
                        </Stack>
                        <Stack direction="row" sx={{ mb: 2, mx: 3 }}>
                            <Grid container spacing={2}>
                                {/* Start Date */}
                                <Grid item xs={12} md={6}>
                                    <DatePicker
                                        fullWidth
                                        label="Start Date"
                                        minDate={today}
                                        value={fromDate}
                                        onChange={(newValue) => {
                                            setValue('fromDate', newValue);
                                            setValue('toDate', null);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                required
                                                fullWidth
                                            />
                                        )}
                                        disableMaskedInput
                                        inputFormat="dd-MMM-yyyy"
                                    />
                                </Grid>

                                {/* End Date */}
                                <Grid item xs={12} md={6}>
                                    <DatePicker
                                        fullWidth
                                        label="End Date"
                                        minDate={fromDate}
                                        value={toDate}
                                        onChange={(newValue) => {
                                            setValue('toDate', newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                required
                                                fullWidth
                                            />
                                        )}
                                        disableMaskedInput
                                        inputFormat="dd-MMM-yyyy"
                                    />
                                </Grid>

                                {/* Select Available Dates */}
                                <Grid item container direction="row" spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <PreferredDay day='monday' />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <PreferredDay day='friday' />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <PreferredDay day='tuesday' />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <PreferredDay day='saturday' />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <PreferredDay day='wednesday' />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <PreferredDay day='sunday' />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <PreferredDay day='thursday' />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Grid>
                </Grid>

                {/* Submit Button */}

                <Grid container justifyContent="flex-end" sx={{ p: 3, pt: 0 }}>
                    {isEdit ? (
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ height: '3em', width: '6em' }}
                        >
                            Edit
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ height: '3em', width: '6em' }}
                        >
                            Create
                        </Button>
                    )}
                </Grid>
            </FormProvider>
        </Dialog>
    )

}

// ----------------------------------------------------------------------

PreferredDay.propTypes = {
    day: PropTypes.string,
};

export function PreferredDay({ day }) {

    const {
        watch,
        setValue,
        resetField,
    } = useFormContext();

    const values = watch();

    const handleClickDay = () => {
        if (values[day].isSelected) {
            setValue(`${day}`, false)
            setValue(`${day}.fromTime`, "")
            setValue(`${day}.toTime`, "")
        } else {
            setValue(`${day}.isSelected`, false)
        }
    };

    // console.log(values[day])

    const TIME_OPTIONS = [
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00'
    ];

    return (
        <Stack direction="row" spacing={2} sx={{ mt: 1 }} justifyContent="flex-start" alignItems="center" >
            <Box sx={{ width: 50 }}>
                <RHFCheckbox name={`${day}.isSelected`} label={day.charAt(0).toUpperCase() + day.slice(1, 3)} onClick={handleClickDay} htmlFor={day} />
            </Box>
            <RHFSelect
                name={`${day}.fromTime`}
                label="From"
                size="small"
                disabled={!values[day].isSelected}
                required={values[day].isSelected}
                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
            >
                {TIME_OPTIONS.map((time) => (
                    <MenuItem
                        key={time}
                        value={time}
                        autoFocus
                        sx={{
                            mx: 1,
                            my: 0.5,
                            borderRadius: 0.75,
                            typography: 'body2',
                            textTransform: 'capitalize',
                            '&:first-of-type': { mt: 0 },
                            '&:last-of-type': { mb: 0 },
                        }}
                    >
                        {time}
                    </MenuItem>
                ))}
            </RHFSelect>

            <Typography variant="inherit" > - </Typography>

            <RHFSelect
                name={`${day}.toTime`}
                label="To"
                size="small"
                disabled={!values[day].fromTime}
                required={values[day].isSelected}
                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
            >
                {TIME_OPTIONS.map((time) => {
                    const toTime = moment(time, "HH:mm")
                    const fromTime = moment(values[day].fromTime, "HH:mm")
                    if (fromTime.isBefore(toTime)) {
                        return (
                            <MenuItem
                                key={time}
                                value={time}
                                sx={{
                                    mx: 1,
                                    my: 0.5,
                                    borderRadius: 0.75,
                                    typography: 'body2',
                                    textTransform: 'capitalize',
                                    '&:first-of-type': { mt: 0 },
                                    '&:last-of-type': { mb: 0 },
                                }}
                            >
                                {time}
                            </MenuItem>
                        )
                    }
                    return null;
                })}
            </RHFSelect>
        </Stack>
    )
}
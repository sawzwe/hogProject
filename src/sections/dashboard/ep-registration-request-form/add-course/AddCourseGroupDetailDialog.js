import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// form
import { useFormContext } from 'react-hook-form';

// @mui
import { Grid, Stack, Dialog, Accordion, AccordionSummary, AccordionDetails, Button, Divider, TextField, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// components
import { useSnackbar } from '../../../../components/snackbar';
import Scrollbar from '../../../../components/scrollbar/Scrollbar';

// assets
import { RHFMultiCheckbox } from '../../../../components/hook-form';


// ----------------------------------------------------------------------

AddCourseGroupDetailDialog.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    course: PropTypes.object,
    onSelect: PropTypes.func,
    onJoin: PropTypes.func,
};

export default function AddCourseGroupDetailDialog({ open, close, course, onSelect, onJoin }) {
    const { watch, resetField } = useFormContext();
    const { enqueueSnackbar } = useSnackbar();

    const values = watch();
    const { groupSelectedSubjects } = values;

    const [currentSubjects, setCurrentSubjects] = useState([]);

    // Get and set subject arrays with information
    function handleSubjectChange(subjects) {
        setCurrentSubjects(subjects.map((subject) => ({ value: subject.name, label: subject.name, members: subject.members, classes: subject.classes, hours: subject.totalHours })))
    }

    const handleJoin = () => {
        if (groupSelectedSubjects.length <= 0) {
            enqueueSnackbar('Please choose at least one subject', { variant: 'error' });
        }
        else {
            const addedCourse = {
                ...course, subjects: course.subjects.filter(subject => groupSelectedSubjects.includes(subject.name)), availableDays: []
            };
            onSelect(addedCourse);
            onJoin();
            close();
        }
    }

    const handleClose = () => {
        resetField('groupSelectedSubjects');
        close();
    }

    // handle subjects when change course
    useEffect(() => {
        if (course.subjects) {
            handleSubjectChange(course.subjects);
        }
    }, [course])

    return (
        <Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose}
            PaperProps={{
                sx: {
                    '&::-webkit-scrollbar': { display: 'none' },
                }
            }}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
                        <Typography variant="h6"> Join Group </Typography>
                        <IconButton variant="h6" onClick={handleClose}> <CloseIcon /> </IconButton>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Stack justifyContent="flex-start" sx={{ py: 1, pl: 3, pr: 1 }} spacing={2}>
                        <Typography variant="h6"> Course Information </Typography>
                        <TextField
                            variant="outlined"
                            id="courseName"
                            defaultValue={course.name}
                            label="Course"
                            disabled
                        />
                        <TextField
                            variant="outlined"
                            id="sectionNo"
                            defaultValue={course.section}
                            label="Section"
                            disabled
                        />
                        <Stack direction="row" justifyContent="flex-start" spacing={2}>
                            <TextField
                                variant="outlined"
                                id="level"
                                defaultValue={course.level}
                                label="Level"
                                disabled
                            />
                            <TextField
                                variant="outlined"
                                id="method"
                                defaultValue={course.method}
                                label="Learning Method"
                                disabled
                            />
                        </Stack>
                        <Stack direction="row" justifyContent="flex-start" spacing={2}>
                            <TextField
                                variant="outlined"
                                id="startDate"
                                defaultValue={course.startDate}
                                label="Start Date"
                                disabled
                            />
                            <TextField
                                variant="outlined"
                                id="endDate"
                                defaultValue={course.endDate}
                                label="End Date"
                                disabled
                            />
                        </Stack>

                        <Stack spacing={1}>
                            {!!course?.subjects &&
                                <>
                                    <Typography variant="subtitle1"> Available subjects </Typography>
                                    <RHFMultiCheckbox name="groupSelectedSubjects" options={currentSubjects} sx={{ mt: 1, mx: 1 }} />
                                </>

                            }
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Scrollbar sx={{ maxHeight: 80 * 5 }}>
                        <Stack justifyContent="flex-start" sx={{ py: 1, px: 3 }} >
                            <Typography variant="h6" sx={{ mb: 2 }}> Classes & Schedules </Typography>
                            {currentSubjects.map((subject, index) => (
                                // Check if subject is selected and get more information from the subject
                                groupSelectedSubjects.some((selectedSubject) => selectedSubject === subject.value) &&
                                <Accordion key={index}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography variant="body2">{course.name} {subject.value.toUpperCase()} - {subject.hours} Hours</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))
                            }
                        </Stack>
                    </Scrollbar>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ p: 3, pt: 0 }}>
                        <Button
                            variant="contained"
                            sx={{ height: '3em', width: '6em' }}
                            onClick={handleJoin}>
                            Join
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Dialog>
    )
}
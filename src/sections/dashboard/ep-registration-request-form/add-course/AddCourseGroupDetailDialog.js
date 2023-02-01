import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Grid, Stack, Dialog, Accordion, AccordionSummary, AccordionDetails, Button, Divider, TextField, DialogTitle, DialogContent, DialogActions, Typography, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// components
import { useSnackbar } from '../../../../components/snackbar';
import Iconify from '../../../../components/iconify';

// assets
import { RHFMultiCheckbox } from '../../../../components/hook-form';


// ----------------------------------------------------------------------

AddCourseGroupDetailDialog.propTypes = {
    courseType: PropTypes.string,
    open: PropTypes.bool,
    close: PropTypes.func,
    course: PropTypes.object,
    onSelect: PropTypes.func,
    subjectOptions: PropTypes.array,
    onJoin: PropTypes.func,
};

export default function AddCourseGroupDetailDialog({ courseType, open, close, course, onSelect, onJoin }) {
    const { watch } = useFormContext();
    const { enqueueSnackbar } = useSnackbar();

    const values = watch();

    const { selectedCourseSubjects } = values;

    const [courseSubjects, setCourseSubjects] = useState([]);

    function handleSubjectChange(subjects) {
        setCourseSubjects(subjects.map((subject) => ({ value: subject.name.toUpperCase(), label: subject.name.toUpperCase(), members: subject.members, classes: subject.classes, hours: subject.totalHours })))
    }

    const handleJoin = () => {
        if (selectedCourseSubjects.length <= 0) {
            enqueueSnackbar('Please choose at least one subject', { variant: 'error' });
        }
        else {
            const addedCourse = {
                ...course, subjects: course.subjects.filter(subject => selectedCourseSubjects.includes(subject.name.toUpperCase())
                )
            };
            onSelect(addedCourse);
            onJoin();
            close();
        }
    }

    // handle subjects when change course
    useEffect(() => {
        if (!!course.subjects) {
            handleSubjectChange(course.subjects);
        }
    }, [course])


    return (
        <Dialog fullWidth maxWidth="lg" open={open} onClose={close}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
                        <Typography variant="h6"> {courseType === 'Group' ? 'Join Group' : 'New Course'} </Typography>
                        <IconButton variant="h6" onClick={close}> <CloseIcon /> </IconButton>
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
                        <Stack spacing={1} sx={{ pb: 1 }}>
                            {!!course?.subjects &&
                                <>
                                    <Typography variant="subtitle1"> Available subjects </Typography>
                                    <RHFMultiCheckbox name="selectedCourseSubjects" options={courseSubjects} sx={{ mx: 1 }} rules={{ required: true }} />
                                </>
                            }
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Stack justifyContent="flex-start" sx={{ py: 1, px: 3 }} >
                        <Typography variant="h6" sx={{ mb: 2 }}> Classes & Schedules </Typography>
                        <Divider />
                        {courseSubjects.map((subject, index) => (
                            // Check if subject is selected and get more information from the subject
                            selectedCourseSubjects.some((selectedSubject) => selectedSubject === subject.value) &&
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
                </Grid>
                <Grid item xs={12} md={12}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ p: 3 }}>
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
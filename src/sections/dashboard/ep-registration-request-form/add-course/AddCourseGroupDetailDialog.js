import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
// form
import { useFormContext, useForm } from 'react-hook-form';

// @mui
import { Grid, Stack, Dialog, Accordion, AccordionSummary, AccordionDetails, Button, Divider, TextField, DialogTitle, DialogContent, DialogActions, Typography, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// components
import { useSnackbar } from '../../../../components/snackbar';
import Iconify from '../../../../components/iconify';

// assets
import { RHFMultiCheckbox, RHFCheckbox } from '../../../../components/hook-form';


// ----------------------------------------------------------------------

const CURRENT_SUBJECTS = [{ value: 'English', label: 'English' }, { value: 'Math', label: 'Math' }]

export const FILTER_GENDER_OPTIONS = [
    { label: 'Men', value: 'Men' },
    { label: 'Women', value: 'Women' },
    { label: 'Kids', value: 'Kids' },
];

AddCourseGroupDetailDialog.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    course: PropTypes.object,
    onSelect: PropTypes.func,
    onJoin: PropTypes.func,
};

export default function AddCourseGroupDetailDialog({ open, close, course, onSelect, onJoin }) {
    const { watch } = useFormContext();
    const { enqueueSnackbar } = useSnackbar();


    const values = watch();
    const { courseType, courses, selectedSubjects } = values;
    const [currentSubjects, setCurrentSubjects] = useState([]);

    // Get and set subject arrays with information
    function handleSubjectChange(subjects) {
        setCurrentSubjects(subjects.map((subject) => ({ value: subject.name, label: subject.name, members: subject.members, classes: subject.classes, hours: subject.totalHours })))
    }

    const handleJoin = () => {
        if (selectedSubjects.length <= 0) {
            enqueueSnackbar('Please choose at least one subject', { variant: 'error' });
        }
        else {
            const addedCourse = {
                ...course, subjects: course.subjects.filter(subject => selectedSubjects.includes(subject.name)), availableDays: []
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
                        <Typography variant="h6"> Join Group </Typography>
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
                                    <RHFMultiCheckbox name="selectedSubjects" options={currentSubjects} sx={{my: 1, mx: 1}} />
                                </>

                            }
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Stack justifyContent="flex-start" sx={{ py: 1, px: 3 }} >
                        <Typography variant="h6" sx={{ mb: 2 }}> Classes & Schedules </Typography>
                        <Divider />
                        {currentSubjects.map((subject, index) => (
                            // Check if subject is selected and get more information from the subject
                            selectedSubjects.some((selectedSubject) => selectedSubject === subject.value) &&
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
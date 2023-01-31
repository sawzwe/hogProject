import PropTypes from 'prop-types';
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
    type: PropTypes.string,
    open: PropTypes.bool,
    close: PropTypes.func,
    course: PropTypes.object,
    onSelect: PropTypes.func,
    subjectOptions: PropTypes.array,
};

export default function AddCourseGroupDetailDialog({ type, open, close, course, onSelect }) {
    const { watch } = useFormContext();

    const values = watch();

    const [currentCourseSubjects, setCurrentCourseSubjects] = useState([]);

    // handle subjects when change course
    useEffect(() => {
        if (!!course.subjects) {
            setCurrentCourseSubjects(course.subjects.map((subject) => ({ value: subject.name.toUpperCase(), label: subject.name.toUpperCase(), members: subject.members, classes: subject.classes, hours: subject.totalHours })))
        }
    }, [course])
    

    return (
        <Dialog fullWidth maxWidth="lg" open={open} onClose={close}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
                        <Typography variant="h6"> {type === 'Group' ? 'Join Group' : 'New Course'} </Typography>
                        <IconButton variant="h6" onClick={close}> <CloseIcon /> </IconButton>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Stack justifyContent="flex-start" sx={{ py: 1, pl: 3, pr: 1 }} spacing={2} position="sticky">
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
                                    <RHFMultiCheckbox name="selectedCourseSubjects" options={currentCourseSubjects} sx={{ mx: 1 }} />
                                </>
                            }
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Stack justifyContent="flex-start" sx={{ py: 1, px: 3 }} >
                        <Typography variant="h6" sx={{ mb: 2 }}> Classes & Schedules </Typography>
                        <Divider />
                        {currentCourseSubjects.map((currentSubject, index) => (
                            // Check if subject is selected and get more information from the subject
                            values.selectedCourseSubjects.some((selectedSubject) => selectedSubject === currentSubject.value) &&
                            <Accordion key={index}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography variant="body2">{course.name} {currentSubject.value.toUpperCase()} - {currentSubject.hours} Hours</Typography>
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
                            onClick={() => {
                                const addedCourse = Object.keys(course).map((key) => (key === 'subjects' ? {[key] : values.selectedCourseSubjects} : {[key]: course[key]}));
                                onSelect(addedCourse);
                                close();
                            }}>
                            Join
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Dialog>
    )
}
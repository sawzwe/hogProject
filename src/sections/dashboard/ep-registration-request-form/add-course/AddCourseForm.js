import PropTypes from 'prop-types';
import { useState } from 'react';
// form
import { useFormContext } from 'react-hook-form';
// components
import { Card, Grid, Typography, Button, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import CourseCard from './CourseCard';
// dialog
import AddCourseDialog from './AddCourseDialog';
// mockup data
import { groupCourses, privateCourses } from '../_mockupData';

AddCourseForm.propTypes = {
    onAddCourse: PropTypes.func,
    onRemoveCourse: PropTypes.func,
    onRemovePrivateCourse: PropTypes.func
}

export default function AddCourseForm({ onAddCourse, onRemoveCourse, onRemovePrivateCourse }) {
    const {
        watch,
        resetField,
    } = useFormContext();

    const values = watch();

    const { courseType, courses } = values;

    const [openAddCourseDialog, setOpenAddCourseDialog] = useState(false);

    const handleOpenAddCourseDialog = () => {
        setOpenAddCourseDialog(true);
    };

    const handleCloseAddCourseDialog = () => {
        resetField('newCourse');
        resetField('newSubject');
        resetField('newLevel');
        resetField('newHoursPerClass');
        resetField('newHour');
        resetField('newLearningMethod');
        resetField('newStartDate');
        resetField('newEndDate');
        resetField('monday');
        resetField('tuesday');
        resetField('wednesday');
        resetField('thursday');
        resetField('friday');
        resetField('saturday');
        resetField('sunday');
        resetField('mondayToTime');
        resetField('tuesdayToTime');
        resetField('wednesdayToTime');
        resetField('thursdayToTime');
        resetField('fridayToTime');
        resetField('saturdayToTime');
        resetField('sundayToTime');
        resetField('mondayFromTime');
        resetField('tuesdayFromTime');
        resetField('wednesdayFromTime');
        resetField('thursdayFromTime');
        resetField('fridayFromTime');
        resetField('saturdayFromTime');
        resetField('sundayFromTime');
        resetField('newAvailableDays');

        setOpenAddCourseDialog(false);
    };

    const handleDeleteCourse = (courseName) => {
        onRemoveCourse(courseName);
    };

    const handleDeletePrivateCourse = (course, subject, level) => {
        onRemovePrivateCourse(course, subject, level);
    }

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
                        <Button variant="outlined" size='large' onClick={handleOpenAddCourseDialog}>
                            {<AddIcon />} {courseType === "Group" ? 'Join Group' : 'New Course'}
                        </Button>
                    </Stack>
                </Grid>
                <AddCourseDialog
                    open={openAddCourseDialog}
                    onClose={handleCloseAddCourseDialog}
                    onSelect={(addedCourse) => onAddCourse(addedCourse)}
                    courseOptions={courseType === 'Group' ? groupCourses : privateCourses}
                />
            </Grid>

            {courses?.map((course) => 
                <CourseCard key={course.name.concat(' ', course.subject, ' ', course.level)} courseType={courseType} course={course} onDelete={handleDeleteCourse} onDeletePrivate={handleDeletePrivateCourse} />
            )}
        </Card>
    )
}
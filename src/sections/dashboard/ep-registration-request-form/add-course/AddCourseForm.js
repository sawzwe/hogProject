import PropTypes from 'prop-types';
import { useState } from 'react';
// form
import { useFormContext } from 'react-hook-form';
// components
import { Card, Grid, Box, Typography, Button, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import CourseCard from './CourseCard';
// hook
import useResponsive from '../../../../hooks/useResponsive';
// dialog
import AddCourseDialog from './AddCourseDialog';
// mockup data
import { groupCourses, privateCourses } from '../_mockupData';

AddCourseForm.propTypes = {
    onAddCourse: PropTypes.func,
    onRemoveCourse: PropTypes.func,
}

export default function AddCourseForm({ onAddCourse, onRemoveCourse }) {
    const {
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const upMd = useResponsive('up', 'md');

    const values = watch();

    const { courseType, courses } = values;

    const [openAddCourseDialog, setOpenAddCourseDialog] = useState(false);

    const handleOpenAddCourseDialog = () => {
        setOpenAddCourseDialog(true);
    };

    const handleCloseAddCourseDialog = () => {
        setOpenAddCourseDialog(false);
    };

    const handleDeleteCourse = (courseId) => {
        onRemoveCourse(courseId);
    };

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

            {courses?.map((course) => {
                return <CourseCard key={course.id} courseType={courseType} course={course} onDelete={handleDeleteCourse} />
            })}
        </Card>
    )
}
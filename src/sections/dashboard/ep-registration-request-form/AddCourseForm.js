import PropTypes from 'prop-types';
import { useState } from 'react';
// form
import { useFormContext } from 'react-hook-form';
// components
import { Card, Grid, Box, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import CourseInfo from './StudentInfo';
// hook
import useResponsive from '../../../hooks/useResponsive';
// dialog
import AddCourseDialog from './AddCourseDialog';
// mockup data
import { groupCourseList } from './_mockupData';

AddCourseForm.propTypes = {
    courseType: PropTypes.string,
    onAddCourse: PropTypes.func,
    onRemoveCourse: PropTypes.func,
}

export default function AddCourseForm({ courseType, onAddCourse, onRemoveCourse }) {
    const {
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const upMd = useResponsive('up', 'md');

    const values = watch();

    const { assignedCourses } = values;

    const [openAddCourseDialog, setOpenAddCourseDialog] = useState(false);

    const handleOpenAddCourseDialog = () => {
        setOpenAddCourseDialog(true);
    };

    const handleCloseAddCourseDialog = () => {
        setOpenAddCourseDialog(false);
    };

    return (
        <Card sx={{ p: 3 }}>
            <Box rowGap={1}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(4, 1fr)',
                }}
                gridTemplateAreas={{
                    xs: `"studentText addStudentButton" `,
                    md: `"studentText studentText addStudentButton addStudentButton"`
                }}>
                <Box gridArea={"studentText"} sx={{ pt: 1.2 }}>
                    <Typography variant="h6">{`New Course(s)`}</Typography>
                </Box>
                <Box gridArea={"addStudentButton"} display="flex" justifyContent="right" alignItems="right">
                    <Button variant="outlined" size='large' onClick={handleOpenAddCourseDialog}>
                        {<AddIcon />} {courseType === "Group" ? 'Join Group' : 'New Course'}
                    </Button>
                </Box>
                <AddCourseDialog
                    type={courseType}
                    open={openAddCourseDialog}
                    onClose={handleCloseAddCourseDialog}
                    selected={assignedCourses}
                    onSelect={(course) => onAddCourse(course)}
                    courseOptions={groupCourseList}
                />
            </Box>
        </Card>
    )
}
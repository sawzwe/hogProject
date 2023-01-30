import PropTypes from 'prop-types';
import { useState } from 'react';
// form
import { useFormContext } from 'react-hook-form';
// components
import { Card, Grid, Box, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import StudentCard from './StudentCard';
// hook
import useResponsive from '../../../../hooks/useResponsive';
// dialog
import AddStudentDialog from './AddStudentDialog';
// mockup data
import { studentList } from '../_mockupData';

AddStudentForm.propTypes = {
    courseType: PropTypes.string,
    studentLimit: PropTypes.number,
    onAddStudent: PropTypes.func,
    onRemoveStudent: PropTypes.func,
};

export default function AddStudentForm({ courseType, studentLimit, onAddStudent, onRemoveStudent }) {
    const {
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const upMd = useResponsive('up', 'md');

    const values = watch();

    const { assignedStudents } = values;

    const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);

    const handleOpenAddStudentDialog = () => {
        setOpenAddStudentDialog(true);
    };

    const handleCloseAddStudentDialog = () => {
        setOpenAddStudentDialog(false);
    };

    const handleDeleteStudent = (studentId) => {
        onRemoveStudent(studentId)
    };

    return (
        <Card sx={{ p: 3 }}>
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center">
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">{`Student(s) ${assignedStudents?.length} / ${studentLimit.toString()}`}</Typography>
                </Grid>
                <Grid container item xs={12} md={6} justifyContent="flex-end">
                    <Button variant="outlined" size='large' onClick={handleOpenAddStudentDialog}>
                        {<AddIcon />} Add Student
                    </Button>
                </Grid>

                <AddStudentDialog
                    type={courseType}
                    open={openAddStudentDialog}
                    onClose={handleCloseAddStudentDialog}
                    limit={studentLimit}
                    selected={assignedStudents}
                    onSelect={(student) => onAddStudent(student)}
                    studentOptions={studentList}
                />
            </Grid>

            {assignedStudents?.map((student) => {
                return <StudentCard key={student.id} id={student.id} fName={student.fName} lName={student.lName} nickname={student.nickname} onDelete={handleDeleteStudent} />
            })
            }
        </Card>
    )
}

//
import PropTypes from 'prop-types';
import { useState } from 'react';
// form
import { useFormContext } from 'react-hook-form';
// components
import { Card, Grid, Box, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import StudentInfo from './StudentInfo';
// hook
import useResponsive from '../../../hooks/useResponsive';
// 
import AddStudentDialog from './AddStudentDialog';
// mockup data
import { studentList } from './studentList';

FormGroup.propTypes ={
    onAddStudent: PropTypes.func,
    onRemoveStudent: PropTypes.func,
}

export default function FormGroup({ onAddStudent, onRemoveStudent }) {
    const {
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const upMd = useResponsive('up', 'md');

    const values = watch();

    const { assignedStudents } = values

    const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);

    const handleOpenAddStudentDialog = () => {
        setOpenAddStudentDialog(true);
    };

    const handleCloseAddStudentDialog = () => {
        setOpenAddStudentDialog(false);
    }

    const handleDeleteStudent = (studentId) => {
        onRemoveStudent(studentId)
    }

    return (
        <Card sx={{ p: 3 }}>
            <Box rowGap={1}
                columnGap={1}
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
                    <Typography variant="h6">{`Student(s)`} {assignedStudents?.length} / 15</Typography>
                </Box>
                <Box gridArea={"addStudentButton"} display="flex" justifyContent="right" alignItems="right">
                    <Button variant="outlined" size='large' onClick={handleOpenAddStudentDialog}>
                        {<AddIcon />} Add Student
                    </Button>
                </Box>

                <AddStudentDialog
                    type={"group"}
                    open={openAddStudentDialog}
                    onClose={handleCloseAddStudentDialog}
                    limit={15}
                    selected={assignedStudents}
                    onSelect={(student) => onAddStudent(student)}
                    studentOptions={studentList}
                />
            </Box>

            {assignedStudents?.map((student) => {
                return <StudentInfo key={student.id} id={student.id} fName={student.fName} lName={student.lName} nickname={student.nickname} onDelete={handleDeleteStudent} />
            })
            }
        </Card>
    )
}
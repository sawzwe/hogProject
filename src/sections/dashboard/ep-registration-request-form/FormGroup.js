import PropTypes from 'prop-types';
import { useState } from 'react';

import { Card, Grid, Box, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { useFormContext } from 'react-hook-form';
import useResponsive from '../../../hooks/useResponsive';
import AddStudentDialog from './AddStudentDialog';

const studentList = [
    { id: '0', fName: 'Thanatuch', lName: 'Lertritsirikul', nickname: 'Tar' },
    { id: '1', fName: 'Piyaphon', lName: 'Wu', nickname: 'Hong' },
    { id: '2', fName: 'Siwach', lName: 'Toprasert', nickname: 'Pan' },
    { id: '3', fName: 'Saw Zwe', lName: 'Wai Yan', nickname: 'Saw' },
    { id: '4', fName: 'Zain Ijaz', lName: 'Janpatiew', nickname: 'Zain' },
    { id: '5', fName: 'Jeffrey', lName: 'Chi Zhi Chong', nickname: 'Jeffrey' },
]

export default function FormGroup() {
    const {
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const upMd = useResponsive('up', 'md');

    const [selectedStudent, setSelectedStudent] = useState([]);

    const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);

    const handleOpenAddStudentDialog = () => {
        setOpenAddStudentDialog(true);
    };

    const handleCloseAddStudentDialog = () => {
        setOpenAddStudentDialog(false);
    }

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
                    <Typography variant="h6">{`Student(s)`}</Typography>
                </Box>
                <Box gridArea={"addStudentButton"} display="flex" justifyContent="right" alignItems="right">
                    <Button variant="outlined" size='large' onClick={handleOpenAddStudentDialog}>
                        {<AddIcon />} Add Student
                    </Button>
                </Box>

                <AddStudentDialog
                    open={openAddStudentDialog}
                    onClose={handleCloseAddStudentDialog}
                    selected={selectedStudent}
                    onSelect={(student) => setSelectedStudent([...selectedStudent, student])}
                    studentOptions={studentList}
                />
            </Box>

            {selectedStudent.map((student) => {
                return <StudentInfo key={student.id} fName={student.fName} lName={student.lName} nickname={student.nickname} />
            })
            }
        </Card>
    )
}

// ----------------------------------------------------------------------

StudentInfo.propTypes = {
    fName: PropTypes.string,
    lName: PropTypes.string,
    nickname: PropTypes.string,
};

function StudentInfo({ fName, lName, nickname }) {
    return (
        <>
            <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>{fName} {lName} ({nickname})</Typography>
        </>
    )
}
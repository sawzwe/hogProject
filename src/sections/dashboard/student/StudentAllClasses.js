import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Divider, Dialog, DialogContent, Typography, Stack, Card } from '@mui/material';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
// components
import ClassCard from '../../../components/app-card/ClassCard';

StudentAllClasses.propTypes = {
    classes: PropTypes.array,
};

export default function StudentAllClasses({ classes }) {

    // Separate Completed class and Incomplete class here
    const completeClass = classes.filter(eachClass => eachClass.attendance !== 'None');
    const upcommingClass = classes.filter(eachClass => eachClass.attendance === 'None');

    // Action Dialog
    const [open, setOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState({});

    const handleOpenDialog = (eachClass) => {
        setSelectedClass(eachClass);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false)
        setTimeout(() => {
            setSelectedClass({})
        }, 200);
    }

    return (
        <>
            {upcommingClass.length > 0 && upcommingClass.map((eachClass, index) => <ClassCard key={index} accountRole="student" eachClass={eachClass} onOpen={handleOpenDialog} />)}
            {upcommingClass.length > 0 && completeClass.length > 0 && <Divider />}
            {completeClass.length > 0 && completeClass.map((eachClass, index) => <ClassCard key={index} accountRole="student" eachClass={eachClass} onOpen={handleOpenDialog} />)}
            {Object.keys(selectedClass).length > 0 && (<ClassDialog open={open} onClose={handleCloseDialog} selectedClass={selectedClass} />)}
        </>
    )
}

// --------------------------------------------------------------------------------------------------------

ClassDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    selectedClass: PropTypes.object,
};

export function ClassDialog({ open, onClose, selectedClass }) {
    const navigate = useNavigate();

    const handleClickMakeup = () => {
        navigate(`/dashboard/student-course/private-course/${selectedClass.course.id}/makeup-class/${selectedClass.id}`)
    }

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={onClose}>
            <DialogContent sx={{ p: 3, textAlign: 'center' }}>
                <Card variant="outlined" sx={{ py: 2, borderRadius: '5px 5px 0px 0px' }}>
                    <Typography variant="h6" sx={{ mx: 'auto' }}>{`${selectedClass.course.course} ${selectedClass.course.subject} ${selectedClass.course.level} (${selectedClass.course.type.toUpperCase()})`} </Typography>
                </Card>
                <Card sx={{ py: 2, borderRadius: 0, backgroundColor: '#007B55', color: 'white' }}>
                    <Typography variant="inherit">
                        {selectedClass.teacher.fullName}
                    </Typography>
                </Card>
                <Card variant="outlined" sx={{ py: 2, borderRadius: '0px 0px 5px 5px' }}>
                    <Stack direction="row" justifyContent="center" spacing={1}>
                        <Typography>
                            {`Time ${selectedClass.fromTime} - ${selectedClass.toTime} `}
                        </Typography>
                        {!!selectedClass.room && (
                            <Typography>
                                {`Room ${selectedClass.room}`}
                            </Typography>
                        )}
                    </Stack>
                </Card>
                {selectedClass.attendance === 'None' && selectedClass.course.type !== 'Group' && (
                    <>
                        <Card sx={{ mt: 3, py: 2, borderRadius: '5px 5px 0px 0px', backgroundColor: '#007B55', color: 'white' }}>
                            <Typography >
                                Actions
                            </Typography>
                        </Card>
                        <Card variant="outlined" sx={{ py: 1, borderRadius: '0px 0px 5px 5px', cursor: 'pointer' }} onClick={handleClickMakeup} >
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ ml: 2, mr:1 }}>
                                <Typography >
                                    Cancel and makeup class
                                </Typography>
                                <NavigateNextRoundedIcon fontSize='large' sx={{color: "#D7D7D7"}} />
                            </Stack>
                        </Card>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}


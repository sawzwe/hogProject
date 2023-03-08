import PropTypes from 'prop-types';
// components
import { Stack, TextField, InputAdornment } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';


StudentCard.propTypes = {
    id: PropTypes.string,
    student: PropTypes.object,
    onRemove: PropTypes.func
};

export default function StudentCard({ id, student, onRemove }) {
    return (
        <Stack flexDirection="row" alignItems="center" mt={2} >
            <TextField
                disabled
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" onClick={() => onRemove(student.studentId)} sx={{cursor: 'pointer'}}>
                            <CloseIcon />
                        </InputAdornment>
                    ),
                }}
                variant="standard"
                sx={{width: 320}}
                value={`${student.studentId} ${student.fName} ${student.lName} (${student.nickname})`}
            /> 
        </Stack>
    )
}
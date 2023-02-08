import PropTypes from 'prop-types';
// components
import { Stack, TextField, InputAdornment } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';


StudentCard.propTypes = {
    id: PropTypes.string,
    fName: PropTypes.string,
    lName: PropTypes.string,
    nickname: PropTypes.string,
    onDelete: PropTypes.func
};

export default function StudentCard({ id, fName, lName, nickname, onDelete }) {
    return (
        <Stack flexDirection="row" alignItems="center" mt={2} >
            <TextField
                disabled
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" onClick={() => {onDelete(id)}} sx={{cursor: 'pointer'}}>
                            <CloseIcon />
                        </InputAdornment>
                    ),
                }}
                variant="standard"
                sx={{width: 320}}
                value={`${fName} ${lName} (${nickname})`}

            /> 
        </Stack>
    )
}
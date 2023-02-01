import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Stack, Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions, Typography, InputAdornment, ListItem, Divider, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// hook
import useResponsive from '../../../../hooks/useResponsive';
// components
import { useSnackbar } from '../../../../components/snackbar';
import Iconify from '../../../../components/iconify';
import { Upload } from '../../../../components/upload';
import SearchNotFound from '../../../../components/search-not-found/SearchNotFound';
import Scrollbar from '../../../../components/scrollbar/Scrollbar';

// ----------------------------------------------------------------------

AddStudentDialog.propTypes = {
    open: PropTypes.bool,
    limit: PropTypes.number,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    studentOptions: PropTypes.array,
};

export default function AddStudentDialog({ open, limit, onClose, onSelect, studentOptions }) {
    const {
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const values = watch();

    const { courseType, students } = values;

    const { enqueueSnackbar } = useSnackbar();

    const [searchStudent, setSearchStudent] = useState('');
    const dataFiltered = applyFilter(studentOptions, searchStudent);
    const isNotFound = !dataFiltered.length && !!searchStudent;

    const handleSearchStudent = (event) => {
        setSearchStudent(event.target.value);
    };

    const handleExceedStudent = () => {
        enqueueSnackbar('Number of student is at limit!', {
            variant: 'error'
        })
    };

    console.log(limit)

    const handleSelectStudent = (student) => {
        if (students.length >= limit) {
            handleExceedStudent();
        }
        else if (courseType === 'Group' || courseType === 'Private') {
            onSelect(student);
            setSearchStudent('');
            onClose();
        }
        else {
            onSelect(student);
            setSearchStudent('');
        }
    }

return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
            <Typography variant="h6"> Select student </Typography>
            <IconButton variant="h6" onClick={onClose}> <CloseIcon /> </IconButton>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ p: 2.5 }}>
            <TextField
                fullWidth
                value={searchStudent}
                onChange={handleSearchStudent}
                placeholder="Search..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                    ),
                }}
            />
        </Stack>

        {isNotFound ? (
            <SearchNotFound query={searchStudent} sx={{ px: 3, pt: 5, pb: 10 }} />
        ) : (
            <Scrollbar sx={{ p: 3, pt: 0, pb: 4, maxHeight: 80 * 8 }}>
                {dataFiltered.map((student) => (
                    !students?.some((s) => s.id === student.id) &&
                    <Box key={student.id}>
                        <ListItem
                            key={student.id}
                            secondaryAction={
                                <Button variant="outlined" onClick={() => handleSelectStudent(student)}> Add </Button>
                            }
                            alignItems="flex-start"
                            sx={{
                                p: 1,
                                mb: 1,
                                mt: 1,
                                borderRadius: 1,
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                '&.Mui-selected': {
                                    bgcolor: 'action.selected',
                                    '&:hover': {
                                        bgcolor: 'action.selected',
                                    },
                                },
                            }}
                        >

                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="subtitle2">
                                {student.id} - {student.fName} {student.lName} ({student.nickname})
                            </Typography>
                        </ListItem>
                        <Divider />
                    </Box>
                )
                )
                }
            </Scrollbar>
        )
        }
    </Dialog>
)
}

// ----------------------------------------------------------------------

function applyFilter(array, query) {
    if (query) {
        return array.filter(
            (student) =>
                student.id.indexOf(query) !== -1 ||
                student.fName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
                student.lName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
                student.nickname.toLowerCase().indexOf(query.toLowerCase()) !== -1
        )
    }

    return array;
}
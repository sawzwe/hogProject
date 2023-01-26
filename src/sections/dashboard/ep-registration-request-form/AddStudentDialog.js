import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
// @mui
import { Stack, Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions, Typography, InputAdornment, ListItem, Divider, Box } from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import { Upload } from '../../../components/upload';
import SearchNotFound from '../../../components/search-not-found/SearchNotFound';
import Scrollbar from '../../../components/scrollbar/Scrollbar';

// ----------------------------------------------------------------------

AddStudentDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    selected: PropTypes.array,
    studentOptions: PropTypes.array,
};

export default function AddStudentDialog({ open, onClose, selected, onSelect, studentOptions }) {
    const [searchStudent, setSearchStudent] = useState('');

    const dataFiltered = applyFilter(studentOptions, searchStudent);

    const isNotFound = !dataFiltered.length && !!searchStudent;

    const handleSearchStudent = (event) => {
        setSearchStudent(event.target.value);
    }

    const handleSelectStudent = (student) => {
        onSelect(student);
        setSearchStudent('');
        onClose();
    };

    return (
        <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
                <Typography variant="h6"> Select student </Typography>

                <Button size="small" startIcon={<Iconify icon="eva:plus-fill" />} sx={{ alignSelf: 'flex-end' }}>
                    New Student
                </Button>
            </Stack>

            <Stack sx={{ p: 2.5 }}>
                <TextField
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
                <Scrollbar sx={{ p: 1.5, pt: 0, pb: 4, maxHeight: 80 * 8 }}>
                    {dataFiltered.map((student) => (
                        !selected.includes(student) &&
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
                                    {student.fName} {student.lName} ({student.nickname})
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
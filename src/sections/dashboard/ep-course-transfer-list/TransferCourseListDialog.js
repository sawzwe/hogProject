import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Stack, Dialog, Button, TextField, Typography, ListItemButton, InputAdornment } from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import SearchNotFound from '../../../components/search-not-found';

// ----------------------------------------------------------------------

TransferCourseListDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    selected: PropTypes.func,
    courseOptions: PropTypes.array,
};

export default function TransferCourseListDialog({ open, selected, onClose, onSelect, courseOptions }) {
    const [searchCourse, setSearchCourse] = useState('');

    const dataFiltered = applyFilter(courseOptions, searchCourse);

    const handleSearchAddress = (event) => {
        setSearchCourse(event.target.value);
    };

    const handleSelectAddress = (address) => {
        onSelect(address);
        setSearchCourse('');
        onClose();
    };

    return (
        <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 2.5, px: 3 }}>
                <Typography variant="h6"> Select address </Typography>

                <Button size="small" startIcon={<Iconify icon="eva:plus-fill" />} sx={{ alignSelf: 'flex-end' }}>
                    Add New
                </Button>
            </Stack>

            <Stack sx={{ p: 2.5 }}>
                <TextField
                    value={searchCourse}
                    onChange={handleSearchAddress}
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
        </Dialog>
    );
}

// ----------------------------------------------------------------------

function applyFilter(array, query) {
    if (query) {
        return array.filter(
            (address) =>
                address.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
                address.company.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
                address.address.toLowerCase().indexOf(query.toLowerCase()) !== -1
        );
    }

    return array;
}

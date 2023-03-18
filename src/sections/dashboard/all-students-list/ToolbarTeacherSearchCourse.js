import PropTypes from 'prop-types';
import {
  InputAdornment, TextField, Tooltip, Typography,
  IconButton, Stack, Button, Drawer, Box, Divider,
  Badge
} from '@mui/material';
import { useState, React } from 'react'
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// ----------------------------------------------------------------------
// const onSelected = (selected, item) =>
//   selected.includes(item) ? selected.filter((value) => value !== item) : [...selected, item];

ToolbarTeacherSearchCourse.propTypes = {
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  isDefault: PropTypes.bool,
  onResetFilter: PropTypes.func,
  filterValue: PropTypes.string,
  onFilterValue: PropTypes.func,
};



// Filter


export default function ToolbarTeacherSearchCourse({ filterValue, onFilterValue, open, onOpen, onClose, isDefault, onResetFilter }) {
  // const { control } = useFormContext();
  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
        <TextField value={filterValue}
        onChange={onFilterValue} 
        id="search-teacher"
        placeholder="Search by teacher's id, name or nickname..." 
        variant="outlined" sx={{ width: '100%'}}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="ic:search" />
              </InputAdornment>
            ),
          }} />
      </Stack>
      

    </>

  );
}

import {InputAdornment,TextField, Tooltip, Typography, IconButton, Stack,Button } from '@mui/material';
// components
import Iconify from '../../../components/iconify';
// Icon
// ----------------------------------------------------------------------

export default function SortingSelectingToolbar() {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
      <TextField id="search-student" label="Search" variant="outlined" sx={{width: 980}} 
      InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="ic:search" />
            </InputAdornment>
          ),
        }}/>
      <Tooltip title="Filter list">
        <Button sx={{ p:2 , m:2}} variant='outlined' endIcon={<Iconify icon="ic:round-filter-list" />}>
          <Typography>Filter</Typography>
        </Button> 
      </Tooltip>
    </Stack>
  );
}

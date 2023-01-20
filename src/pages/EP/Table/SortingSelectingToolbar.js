import {InputAdornment,TextField, Tooltip, Typography, 
  IconButton, Stack,Button,Drawer,Box,Divider,
  List,ListItem,ListItemButton,ListItemText,MenuItem,Checkbox } from '@mui/material';
import { useState,React } from 'react'
// components
import Iconify from '../../../components/iconify';
// Icon
// ----------------------------------------------------------------------

export default function SortingSelectingToolbar() {

// Open and CLose Drawer
const [openDrawer,setOpenDrawer] = useState(false)
// Checkbox
const [groupchecked, setGroupChecked] = useState(false);
const [privatechecked, setPrivateChecked] = useState(false);
const [semiprivatechecked, setSemiprivateChecked] = useState(false);

const handleGroupChange = (event) => {
  setGroupChecked(event.target.checked);
};
const handlePrivateChange = (event) => {
  setPrivateChecked(event.target.checked);
};
const handleSemiChange = (event) => {
  setSemiprivateChecked(event.target.checked);
};

// List Of Selections
const course = [
{
value: 'SAT',
label: 'SAT',
},
{
value: 'GED',
label: 'GED',
},
{
value: 'IGCSE',
label: 'IGCSE',
},
{
value: 'IELTS',
label: 'IELTS',
},
];
const subject = [
{
value: 'VER',
label: 'VERBAL',
},
{
value: 'WRI',
label: 'WRITTEN',
},
];
const level = [
{
value: 'INT',
label: 'INTENSIVE',
},
{
value: 'NOR',
label: 'NORMAL',
},
];
// Set Period
//  const [value, setValue] = useState(dayjs('2014-08-18T21:11:54'));

// const handlePeriodChange = (newValue) => {
//   setValue(newValue);
// };

return (
<>
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
  <Button sx={{ p:2 , m:2}} variant='outlined' onClick={()=>setOpenDrawer(true)} endIcon={<Iconify icon="ic:round-filter-list" />}>
    <Typography>Filter</Typography>
  </Button> 
</Tooltip>
</Stack>

<Drawer anchor='right' open={openDrawer} onClose={()=> setOpenDrawer(false)}>
  <Box p={2} width='250px' textAlign='left' role='presentation'>
    <Typography variant='h6' >Filter </Typography> <Iconify icon="ic:close" position="end" onClick={()=> setOpenDrawer(false)} />
    <Divider/>
    <Typography variant='h6' >Course Type </Typography>
    <List>
      <ListItem><Checkbox
      checked={groupchecked}
      onChange={handleGroupChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />Group
    </ListItem>
    <ListItem>
      <Checkbox
      checked={privatechecked}
      onChange={handlePrivateChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />Private 
    </ListItem>
    <ListItem><Checkbox
      checked={semiprivatechecked}
      onChange={handleSemiChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />Semi-Private
    </ListItem>


  {/* {['Group', 'Private', 'Semi-Private'].map((text, index) => (
    <ListItem key={text} disablePadding>
      <ListItemButton>
      <Checkbox
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    /><ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  ))} */}
</List>
<Divider/>
<Typography variant='h6'>Course</Typography>
<Box p={2}>
  <div>
  <TextField
    id="outlined-select-course"
    select
    label="Course"
    defaultValue="SAT"
    helperText="               "
    sx={{width: 180}}
    
  >
    {course.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
  </div>
  <div>
  <TextField
    id="outlined-select-subject"
    select
    label="Subject"
    defaultValue="VER"
    helperText="               "
    sx={{width: 180}}
  >
    {subject.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
  </div>
  <div>
  <TextField
    id="outlined-select-level"
    select
    label="Level"
    defaultValue="INT"
    helperText="               "
    sx={{width: 180}}
  >
    {level.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
  </div>

</Box>

<Divider/>
<Typography variant='h6' >Period</Typography>
{/* <DesktopDatePicker
          label="Date desktop"
          inputFormat="MM/DD/YYYY"
          value={value}
          onChange={handlePeriodChange}
          renderInput={(params) => <TextField {...params} />}
        /> */}
  </Box>
</Drawer>


</>

);
}

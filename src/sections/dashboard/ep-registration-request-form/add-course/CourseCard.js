import PropTypes from 'prop-types';
// components
import { Typography, Button, Paper, TextField, Grid } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { fDate } from '../../../../utils/formatTime';


CourseCard.propTypes = {
    courseIndex: PropTypes.number,
    courseInfo: PropTypes.object,
    onRemove: PropTypes.func,
    onEdit: PropTypes.func
};

export default function CourseCard({ courseIndex, courseInfo, onRemove, onEdit }) {

    const {
        courseName,
        subject,
        level,
        method,
        hourPerClass,
        totalHour,
        startDate,
        endDate,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday
    } = courseInfo;

    const preferredDays = [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

    return (
        <Paper elevation={2} sx={{ mt: 2, p: 3 }}>

            <Grid container direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={12} md={4}>
                    <TextField fullWidth disabled label="Course" value={courseName} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField fullWidth disabled label="Subject" value={subject} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField fullWidth disabled label="Level" value={level} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField fullWidth disabled label="Start Date" value={fDate(startDate, 'dd-MMM-yyyy')} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField fullWidth disabled label="End Date" value={fDate(endDate, 'dd-MMM-yyyy')} />
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField fullWidth disabled label="Learning Method" value={method} />
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField fullWidth disabled label="Total Hours" value={totalHour} />
                </Grid>
            </Grid>

            {/* <Typography variant="inherit" sx={{ color: 'text.disabled' }}>Preferred Days</Typography> */}
            {/* <Grid container direction="row" spacing={1} sx={{ mt: 1 }}>
                {preferredDays.map((eachDay, index) => eachDay.isSelected && (
                    <Grid item xs={6} md={1.71} key={index}>
                        <TextField size='small' label={days[index].slice(0, 1).toUpperCase() + days[index].slice(1)} value={`${eachDay.fromTime} - ${eachDay.toTime}`} disabled />
                    </Grid>
                ))}
            </Grid> */}

            <Grid container direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 1 }}>
                <Grid item>
                    <Button variant="outlined" size='medium' color="inherit" onClick={() => onEdit(courseIndex)} sx={{ mr: 1, mb: 1 }}>
                        <EditRoundedIcon /> Edit
                    </Button>
                    <Button variant="outlined" size='medium' color="error" onClick={() => onRemove(courseIndex)} sx={{ mr: 1, mb: 1 }}>
                        <DeleteIcon /> Remove
                    </Button>
                </Grid>
            </Grid>
        </Paper>

    )
}
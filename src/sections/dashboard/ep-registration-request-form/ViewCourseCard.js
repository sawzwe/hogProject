import PropTypes from 'prop-types';
// components
import { Typography, Button, Paper, TextField, Grid } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { fDate } from '../../../utils/formatTime';


ViewCourseCard.propTypes = {
    courseIndex: PropTypes.number,
    courseInfo: PropTypes.object,
    onView: PropTypes.func,
};

export default function ViewCourseCard({ courseIndex, courseInfo, onView }) {

    const {
        course,
        subject,
        level,
        method,
        fromDate,
        toDate,
    } = courseInfo;

    return (
        <Paper variant="outlined" sx={{ mt: 2, p: 3 }}>

            <Grid container direction="row" justifyContent="space-between">
                <Grid item xs={12} md={4.25}>
                    <TextField fullWidth variant="standard" disabled label="Course" value={`${course} ${subject} ${level}`} />
                </Grid>
                <Grid item xs={12} md={2.25}>
                    <TextField fullWidth variant="standard" disabled label="Start Date" value={fDate(fromDate, 'dd-MMM-yyyy')} />
                </Grid>
                <Grid item xs={12} md={2.25}>
                    <TextField fullWidth variant="standard" disabled label="End Date" value={fDate(toDate, 'dd-MMM-yyyy')} />
                </Grid>
                <Grid item xs={12} md={2.75}>
                    <Button fullWidth variant="outlined" size='large' color="inherit" onClick={() => onView(courseIndex)} sx={{fontSize: '0.9rem'}}>
                        <InfoIcon sx={{mr: 1}} /> Course Detail
                    </Button>
                </Grid>
            </Grid>
        </Paper>

    )
}
import PropTypes from 'prop-types';
// components
import { Typography, Button, Paper, Stack, IconButton, TextField, Input, InputLabel, InputAdornment, Grid } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';


CourseCard.propTypes = {
    courseType: PropTypes.string,
    course: PropTypes.object,
    onDelete: PropTypes.func
};

export default function CourseCard({ courseType, course, onDelete }) {
    return (
        <Paper elevation={2} sx={{ mt: 2, p: 3 }}>
            {courseType === 'Group' ? (
                <>
                    <Grid container
                        direction="column"
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="flex-start">
                        <Grid container item xs={12} md={12}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{course.name} ({courseType.toUpperCase()})</Typography>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth disabled label="Section" value={course.section} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField fullWidth disabled label="Start Date" value={course.startDate} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField fullWidth disabled label="End Date" value={course.endDate} />
                        </Grid>
                    </Grid>

                    <Grid container direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={12}>
                            <TextField fullWidth disabled label="Section" value={course.subjects.map(subject => subject.name.toUpperCase()).join(' | ')} />
                        </Grid>
                    </Grid>

                    <Grid container direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 1 }}>
                        <Grid item>
                            <Button variant="outlined" size='medium' color="error" onClick={() => { onDelete(course.id) }} sx={{ mr: 1, mb: 1 }}>
                                <DeleteIcon /> Remove
                            </Button>
                        </Grid>
                    </Grid>
                </>

            ) : (

                <>
                    <Grid container
                        direction="column"
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="flex-start">
                        <Grid container item xs={12} md={12}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{course.name} {course.subject} {course.level} ({courseType.toUpperCase()}) - {course.totalHours}</Typography>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth disabled label="Start Date" value={course.startDate} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField fullWidth disabled label="End Date" value={course.endDate} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField fullWidth disabled label="Learning Method" value={course.method} />
                        </Grid>
                    </Grid>

                    <Grid container direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={12}>
                            <TextField fullWidth disabled label="Available Days" value={course.availableDays.map(eachDay => eachDay.day.charAt(0).toUpperCase() + eachDay.day.slice(1,3).concat(" ", eachDay.from, " - ", eachDay.to)).join(' | ')} />
                        </Grid>
                    </Grid>
                </>
            )
            }
        </Paper>

    )
}
import PropTypes from 'prop-types';
// components
import { Typography, Button, Paper, TextField, Grid } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';


CourseCard.propTypes = {
    courseType: PropTypes.string,
    course: PropTypes.object,
    onDelete: PropTypes.func,
    onDeletePrivate: PropTypes.func
};

export default function CourseCard({ courseType, course, onDelete, onDeletePrivate }) {

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
                        <Grid item xs={12} md={3}>
                            <TextField fullWidth disabled label="Section" value={course.section} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField fullWidth disabled label="Learning Method" value={course.method} />
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
                            <TextField fullWidth disabled label="Subject" value={course.subjects.map(subject => subject.name.toUpperCase()).join(' | ')} />
                        </Grid>
                    </Grid>

                    <Grid container direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 1 }}>
                        <Grid item>
                            <Button variant="outlined" size='medium' color="error" onClick={() => { onDelete(course.name) }} sx={{ mr: 1, mb: 1 }}>
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
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{course.name} {course.subject} {course.level} ({courseType.toUpperCase()})</Typography>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" spacing={1} sx={{ mt: 1, mb: 2  }}>
                        <Grid item xs={12} md={3}>
                            <TextField fullWidth disabled label="Start Date" value={course.startDate} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField fullWidth disabled label="End Date" value={course.endDate} />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField fullWidth disabled label="Total Hours" value={course.totalHours} />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField fullWidth disabled label="Learning Method" value={course.method} />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField fullWidth disabled label="Hours/Class" value={course.hoursPerClass} />
                        </Grid>
                    </Grid>

                    <Typography variant="inherit" sx={{color: 'text.disabled'}}>Available Days</Typography>
                    <Grid container direction="row" spacing={1} sx={{ mt: 1 }}>
                        {course.availableDays.map((eachDay, index) => (
                            <Grid item xs={6} md={1.71} key={index}>
                                <TextField label={eachDay.day.slice(0,1).toUpperCase() + eachDay.day.slice(1)} value={`${eachDay.from} - ${eachDay.to} hrs`} disabled />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 1 }}>
                        <Grid item>
                            <Button variant="outlined" size='medium' color="error" onClick={() => { onDeletePrivate(course.name, course.subject, course.level) }} sx={{ mr: 1, mb: 1 }}>
                                <DeleteIcon /> Remove
                            </Button>
                        </Grid>
                    </Grid>
                </>
            )
            }
        </Paper>

    )
}
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Paper,
    Grid,
    TextField,
    Button
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EventNoteIcon from '@mui/icons-material/EventNote';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';

ClassPaper.propTypes = {
    _course: PropTypes.object,
    _request: PropTypes.object,
    onSelect: PropTypes.func,
    onDelete: PropTypes.func,
    role: PropTypes.string,
    pending: PropTypes.bool,
}

export function ClassPaper({ _course, _request, onSelect, onDelete, role, pending }) {

    const {
        course,
        subject,
        level,
        totalHour,
        section
    } = _course;

    const {
        paymentStatus,
        courseType
    } = _request;

    return (
        <Paper variant="elevation" elevation={2} sx={{ p: 3 }}>
            <Grid container direction="row" spacing={2}>
                <Grid item xs={12} md={3.5}>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Course"
                        defaultValue={`${course} ${subject} ${level}`}
                    />
                </Grid>
                <Grid item xs={12} md={2.875}>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Course type"
                        defaultValue={courseType}
                    />
                </Grid>
                <Grid item xs={12} md={2.875}>
                    <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        label="Section name"
                        defaultValue={section}
                    />
                </Grid>
                <Grid item xs={12} md>
                    <Button fullWidth variant="contained" color="inherit" sx={{ height: 56 }} onClick={() => onSelect(_course)}>
                        {role === 'Education Admin' ? (
                            <>
                                <EditIcon sx={{ mr: 1 }} />
                                Edit
                            </>
                        ) : (
                            <>
                                <EventNoteIcon sx={{ mr: 1 }} />
                                schedule
                            </>
                        )
                        }
                    </Button>
                </Grid>

                {role === 'Education Admin' && (
                    <Grid item xs md>
                        <Button fullWidth variant="contained" color="error" sx={{ height: 56 }} onClick={() => onDelete(_course)}>
                            <DeleteRoundedIcon sx={{ mr: 1 }} /> Remove
                        </Button>
                    </Grid>
                )}

            </Grid>
        </Paper>
    )
}
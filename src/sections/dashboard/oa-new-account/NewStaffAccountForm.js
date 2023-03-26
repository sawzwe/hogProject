import { useState } from 'react';
// @mui
import { Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
// sections
import EAForm from './EAForm';
import EPForm from './EPForm';
import TeacherForm from './TeacherForm';
import OAForm from './OAForm';

// ----------------------------------------------------------------------

const STAFF_ROLES_OPTIONS = [
    { role: 'Teacher' },
    { role: 'Education Admin' },
    { role: 'Education Planner' },
    { role: 'Office Admin' },
];

export default function NewAccountForm() {

    const [role, setRole] = useState('Teacher');

    const handleChangeRole = (event) => {
        setRole(event.target.value);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
                <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                        fullWidth
                        value={role}
                        label="Role"
                        native={false}
                        inputProps={{ sx: { textTransform: 'capitalize' } }}
                        onChange={handleChangeRole}
                    >
                        {STAFF_ROLES_OPTIONS.map((option) => (
                            <MenuItem
                                key={option.role}
                                value={option.role}
                                sx={{
                                    mx: 1,
                                    my: 0.5,
                                    borderRadius: 0.75,
                                    typography: 'body2',
                                    textTransform: 'capitalize',
                                    '&:first-of-type': { mt: 0 },
                                    '&:last-of-type': { mb: 0 },
                                }}
                            >
                                {option.role}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {role === "Education Admin" && (
                <Grid item xs={12} md={12}>
                    <EAForm />
                </Grid>
            )}

            {role === "Education Planner" && (
                <Grid item xs={12} md={12}>
                    <EPForm />
                </Grid>
            )}

            {role === "Teacher" && (
                <Grid item xs={12} md={12}>
                    <TeacherForm />
                </Grid>
            )}

            {role === "Office Admin" && (
                <Grid item xs={12} md={12}>
                    <OAForm />
                </Grid>
            )}

        </Grid>
    )
}
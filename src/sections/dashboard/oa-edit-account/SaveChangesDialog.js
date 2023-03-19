import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
// @mui
import { LoadingButton } from '@mui/lab';
import { Stack, Typography, Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// components
import { useSnackbar } from '../../../components/snackbar';
import { HOG_API } from '../../../config';

SaveChangesDialog.propTypes = {
    data: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    accountRole: PropTypes.string
}

export default function SaveChangesDialog({ data, open, onClose, accountRole }) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        try {
            if (accountRole === 'Teacher') {

                const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
                const preferredDays = [data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday, data.sunday]

                const workTimes = []
                preferredDays.forEach((day, index) => {
                    if (day.isSelected) {
                        workTimes.push({ day: weekdays[index], fromTime: day.fromTime, toTime: day.toTime })
                    }
                })

                const formattedData = {
                    id: data.id,
                    fName: data.fName,
                    lName: data.lName,
                    nickname: data.nickname,
                    phone: data.phone,
                    email: data.email,
                    line: data.line,
                    workTimes
                }

                await axios.put(`${HOG_API}/api/Teacher/Put`, formattedData)
                    .then((res) => console.log(res))
                    .catch((error) => {
                        throw error
                    })

                // console.log('teacher')
                // console.log("Save changes will be added!", formattedData);
                enqueueSnackbar("Save changes successfully", { variant: 'success' });
                navigate(`/account/teacher-management/teacher/${data.id}`);
            }
            setIsSubmitting(false);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog maxWidth="md" open={open} onClose={onClose}>
            <DialogTitle>
                <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
                    <Typography variant='h4'>Edit Account?</Typography>
                </Stack>
            </DialogTitle>
            <DialogContent>
                The account will be editted according to this information once submitted.
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <LoadingButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    loading={isSubmitting}
                    onClick={handleSaveChanges}
                >
                    Save Changes
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}
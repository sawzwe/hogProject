import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router';
// @mui
import { LoadingButton } from '@mui/lab';
import { Stack, Typography, Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// components
import { useSnackbar } from '../../../components/snackbar';

SaveChangesDialog.propTypes = {
    data: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
}

export default function SaveChangesDialog({ data, open, onClose }) {
    const { enqueueSnackbar } = useSnackbar();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        console.log("Save changes will be added soon!", data);
        enqueueSnackbar("Save changes successfully", { variant: 'success' });
        setIsSubmitting(false);

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
import PropTypes from 'prop-types';
import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
// @mui
import { LoadingButton } from '@mui/lab';
import { Stack, Typography, Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// components
import { useSnackbar } from '../../../components/snackbar';

DeleteAccountDialog.propTypes = {
    accountId: PropTypes.string,
    accountRole: PropTypes.string,
    accountName: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
}

export default function DeleteAccountDialog({ accountId, accountRole, accountName, open, onClose }) {
    const { enqueueSnackbar } = useSnackbar();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        setIsSubmitting(true);
        console.log("Delete account will be added soon!, Account's id, role = ", accountId, accountRole);
        enqueueSnackbar("Deleted the account successfully", { variant: 'success' });
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
                {`Once deleted, ${accountName}'s account will be permanently deleted and no longer be accessible.`}
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
                    color="error"
                    loading={isSubmitting}
                    onClick={handleDelete}
                >
                    Delete
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}
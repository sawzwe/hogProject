import PropTypes from 'prop-types';
import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
// @mui
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { Stack, Typography, Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// components
import { useSnackbar } from '../../../components/snackbar';
import { HOG_API } from '../../../config';

DeleteAccountDialog.propTypes = {
    accountId: PropTypes.string,
    accountRole: PropTypes.string,
    accountName: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
}

export default function DeleteAccountDialog({ accountId, accountRole, accountName, open, onClose }) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const element = document.querySelector('#delete-request-error-handling .status');
    
    const handleDelete = async () => {
      setIsSubmitting(true);
    
      try {
        await axios.delete(`${HOG_API}/api/Teacher/Delete/${accountId}`);
        enqueueSnackbar("Deleted the account successfully", { variant: 'success' });
        navigate(-1)
      } catch (error) {
        console.error('There was an error!', error);
        element.parentElement.innerHTML = `Error: ${error.message}`;
      }
    
      setIsSubmitting(false);
    };
    
      

    return (
        <Dialog maxWidth="md" open={open} onClose={onClose}>
            <DialogTitle>
                <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
                    <Typography variant='h4'>Delete Account?</Typography>
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
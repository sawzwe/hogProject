import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { LoadingButton } from '@mui/lab';
import { Stack, Typography, Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// components
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------

ResetPasswordDialog.propTypes = {
    accountId: PropTypes.string,
    accountRole: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    defaultPassword: PropTypes.string
}

export default function ResetPasswordDialog({ accountId, accountRole, open, onClose, defaultPassword }) {

    const { enqueueSnackbar } = useSnackbar();

    const [isResetingPassword, setIsResetingPassword] = useState(false);

    const handleResetPassword = async () => {
        setIsResetingPassword(true);
        console.log("Reset will be added soon (Don't forget to pass account id)")
        enqueueSnackbar("Reset password successfully", { variant: 'success' });
        setIsResetingPassword(false);
    }

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
            <DialogTitle>
                <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
                    <Typography variant='h4'>Reset Password?</Typography>
                </Stack>
            </DialogTitle>
            <DialogContent>
                {`The password will be reset to default (${defaultPassword}).`}
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
                    variant="contained"
                    color="primary"
                    onClick={handleResetPassword}
                    loading={isResetingPassword}
                >
                    Reset
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
} 
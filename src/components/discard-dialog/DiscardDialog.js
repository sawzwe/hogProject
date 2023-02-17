import PropTypes from 'prop-types';
// @mui
import { Dialog, Button, DialogTitle, DialogActions, DialogContent, Typography } from '@mui/material';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

DiscardDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onDiscard: PropTypes.func,
    title: PropTypes.string,
    content: PropTypes.string
};

export function DiscardDialog({ open, onClose, onDiscard, title, content }) {
    return (
        <Dialog open={open} fullWidth maxWidth="xs">
            <DialogTitle sx={{ mx: 'auto', pb: 0 }}>
                <ErrorRoundedIcon sx={{ fontSize: '100px' }} />
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" align="center" sx={{ fontWeight: 'bold', fontSize: 'h5.fontSize', mb: 1 }}>
                    {title}
                </Typography>
                <Typography align="center">
                    {content}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button fullWidth variant="outlined" color="inherit" onClick={onClose}>Cancel</Button>
                <Button fullWidth variant="contained" color="error" onClick={onDiscard}>Discard</Button>
            </DialogActions>
        </Dialog>
    )
}
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Typography, Grid, Stack, Button, TextField, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
// components
import MakeupCard from '../../../components/app-card/MakeupCard';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
// utils
import { fDate } from '../../../utils/formatTime';

StudentMakeup.propTypes = {
    currentCourse: PropTypes.object,
    currentClass: PropTypes.object
};

export default function StudentMakeup({ currentCourse, currentClass }) {

    // Specific class
    const {
        id,
        classNo,
        course,
        date,
        fromTime,
        toTime,
        room,
        subject,
        teacher
    } = currentClass;

    // Sent Dialog
    const [openDialog, setOpenDialog] = useState(false);
    const handleCloseDialog = () => {
        console.log('Go to another page!');
        setOpenDialog(false);
    };

    // Input Validation
    const MakeupRequestSchema = Yup.object().shape({
        remark: Yup.string().required('Remark is required')
    });

    const defaultValues = {
        remark: ''
    }

    const methods = useForm({
        resolver: yupResolver(MakeupRequestSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        setError,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const onSubmit = async (data) => {
        try {
            console.log(data);
            setOpenDialog(true);
        } catch (error) {
            console.error(error.message);
            setError('afterSubmit', {
                ...error,
                message: error.message
            });
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container sx={{ my: 2 }}>
                <Grid item xs md>
                    <Card variant='outlined' sx={{ py: 2, px: 2, borderRadius: 1 }}>
                        <Typography>
                            {`${fDate(date, 'dd MMMM yyyy')} | ${fromTime} - ${toTime}`}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                            {`${course.subject} (${course.type})`}
                        </Typography>
                        <Typography variant="caption" component='div' color='text.secondary'>
                            {teacher.fullName}
                        </Typography>
                    </Card>
                </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mx: 1, mt: 3, mb: 1.5 }}>
                Makeup Request
            </Typography>
            <RHFTextField name="remark" label="Remark" multiline rows={3} />

            <LoadingButton fullWidth size="large" type="submit" variant="contained" color="primary" loading={isSubmitting} sx={{ mt: 3 }}>
                Submit
            </LoadingButton>

            <Dialog open={openDialog}>
                <DialogTitle sx={{ mx: 'auto', pb: 0 }}>
                    <MarkEmailReadIcon sx={{ fontSize: '100px' }} />
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" align="center" sx={{ fontWeight: 'bold', fontSize: 'h5.fontSize', mb: 1 }}>
                        Your request is received
                    </Typography>
                    <Typography align="center">
                        The reply will be sent to your request inbox within 1 - 2 days.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button fullWidth variant="contained" color="primary" onClick={handleCloseDialog}>Tap to close</Button>
                </DialogActions>
            </Dialog>
        </FormProvider>
    )
}

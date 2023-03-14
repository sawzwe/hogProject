import { useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function EAForm() {
    const { registerEA } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();

    const NewEASchema = Yup.object().shape({
        role: Yup.string().required('Role is required'),
        fName: Yup.string().required('Firstname is required'),
        lName: Yup.string().required('Lastname is required'),
        nickname: Yup.string().required('Nickname is required'),
        phone: Yup.string().required('Phone number is required'),
        line: Yup.string().required('Line ID is required'),
        email: Yup.string().email('Email is invalid').required('Email is required'),
    });

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const defaultValues = {
        role: 'Education Admin',
        fName: '',
        lName: '',
        nickname: '',
        phone: '',
        line: '',
        email: '',
    };

    const methods = useForm({
        resolver: yupResolver(NewEASchema),
        defaultValues,
    });

    const {
        setError,
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const [createdData, setCreatedData] = useState({});
    const onSubmit = async (data) => {
        try {
            setCreatedData(data)
            setOpenConfirmDialog(true);
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });

            setError('afterSubmit', {
                ...error,
                message: error.message
            });
        }
    };

    const [createLoading, setCreateLoading] = useState(false);

    const handleCreateAccount = async () => {
        setCreateLoading(true);
        try {
            await registerEA(createdData);
            reset(defaultValues);
            setOpenConfirmDialog(false);
            setCreateLoading(false);
            enqueueSnackbar("Account has been created!", { variant: 'success' })
        } catch (error) {
            setCreateLoading(false);
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ p: 3 }}>
                <Typography variant="h6"
                    sx={{
                        mb: 2,
                        display: 'block',
                    }}
                >
                    {`Create Account Form (EA)`}
                </Typography>

                <Grid direction="row" container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="fName" label="First name" required />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="lName" label="Last name" required />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="nickname" label="Nickname" required />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField isNumber name="phone" label="Phone number" required />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="line" label="Line ID" required />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="email" label="Email" required />
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Stack direction="row" justifyContent="flex-end" alignItems="center">
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Create
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Card>

            <Dialog maxWidth="md" open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                <DialogTitle>
                    <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
                        <Typography variant='h4'>Create Account</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    The account will be created according to this information once the form is submitted.
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={() => setOpenConfirmDialog(false)}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        loading={createLoading}
                        onClick={handleCreateAccount}
                    >
                        Submit
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </FormProvider >
    )
}
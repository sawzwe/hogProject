import PropTypes from 'prop-types';
import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Stack, Typography, Button } from '@mui/material';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
//
import SaveChangesDialog from './SaveChangesDialog';

// ----------------------------------------------------------------------

EditStaff.propTypes = {
    currentStaff: PropTypes.object
}

export default function EditStaff({ currentStaff }) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const NewStaffSchema = Yup.object().shape({
        role: Yup.string().required('Role is required'),
        fName: Yup.string().required('Firstname is required'),
        lName: Yup.string().required('Lastname is required'),
        nickname: Yup.string().required('Nickname is required'),
        phone: Yup.string().required('Phone number is required'),
        line: Yup.string().required('Line ID is required'),
        email: Yup.string().email('Email is invalid').required('Email is required'),
    });

    const defaultValues = {
        role: currentStaff?.role || '',
        fName: currentStaff?.fName || '',
        lName: currentStaff?.lName || '',
        nickname: currentStaff?.nickname || '',
        phone: currentStaff?.phone || '',
        line: currentStaff?.line || '',
        email: currentStaff?.email || '',
    };

    const methods = useForm({
        resolver: yupResolver(NewStaffSchema),
        defaultValues,
    });

    const {
        setError,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const [savedData, setSavedData] = useState({});
    const [openSaveChangesDialog, setOpenSaveChangesDialog] = useState(false);

    const onSubmit = async (data) => {
        try {
            await setSavedData(data);
            await setOpenSaveChangesDialog(true);
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });

            setError('afterSubmit', {
                ...error,
                message: error.message
            });
        }
    };

    const onError = () => {
        enqueueSnackbar("Form has not been filled correctly!", { variant: 'error' });
    };

    const handleCancelEdit = () => {
        navigate(`/account/staff-management/staff/${currentStaff.id}`);
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
            <Card sx={{ p: 3 }}>
                <Typography variant="h6"
                    sx={{
                        mb: 2,
                        display: 'block',
                    }}
                >
                    {`Edit Account (${currentStaff.role})`}
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
                        <RHFTextField name="phone" label="Phone number" required />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="line" label="Line ID" required />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField name="email" label="Email" required />
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Save changes
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Card>

            <SaveChangesDialog
                open={openSaveChangesDialog}
                onClose={() => setOpenSaveChangesDialog(false)}
                data={savedData}
            />


        </FormProvider >
    )
}
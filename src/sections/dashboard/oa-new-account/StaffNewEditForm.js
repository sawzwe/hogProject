import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useMemo, useEffect } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Chip, Grid, Stack, Typography, TextField, MenuItem, Button } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

const STAFF_ROLES_OPTIONS = [
    { id: 1, name: 'Education Admin' },
    { id: 2, name: 'Education Planner' },
    { id: 3, name: 'Test' }
];

StaffNewEditForm.propTypes = {
    isEdit: PropTypes.bool,
    currentStaff: PropTypes.object,
};

export default function StaffNewEditForm({ isEdit = false, currentStaff }) {

    const { enqueueSnackbar } = useSnackbar();

    const NewEASchema = Yup.object().shape({
        eaRole: Yup.string().required('Role is required'),
        eaFirstName: Yup.string().required('Firstname is required'),
        eaLastName: Yup.string().required('Lastname is required'),
        eaNickname: Yup.string().required('Nickname is required'),
        eaPhoneNumber: Yup.string().required('Phone number is required'),
        eaLineId: Yup.string().required('Line ID is required'),
        eaEmail: Yup.string().email('Email is invalid').required('Email is required'),
    });

    const defaultValues = {

        eaRole: 'Education Admin',
        eaFirstName: '',
        eaLastName: '',
        eaNickname: '',
        eaPhoneNumber: '',
        eaLineId: '',
        eaEmail: '',
        eaRole2: '',

    }

    const methods = useForm({
        resolver: yupResolver(NewEASchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const { eaRole } = values

    // Create staff to Firebase Auth, Firestore, and Azure Database
    const createStaff = () => {
        // Add Logic here

        enqueueSnackbar('Create success!')
    }

    // Update staff data to the database
    const updateStaff = () => {
        // Add Logic here

        enqueueSnackbar('Update success!')
    }

    useEffect(() => {
        if (isEdit && currentStaff) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currentStaff]);


    const onSubmit = async (data) => {
        try {
            // updateStaff(data);
            if (isEdit) {
                await updateStaff(data);
            } else {
                await createStaff(data);
            }
            console.log('DATA', JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangeeaRole = (event) => {
        reset(defaultValues);
        setValue('eaRole', event.target.value);
    }

    const [submitDialogOpen, setSubmitDialogopen] = useState(false);

    const handleClickSubmitOpen = (event) => {
        event.preventDefault()
        setSubmitDialogopen(true);
    };

    const handleSubmitClose = () => {
        setSubmitDialogopen(false);
    };





    return (
        <FormProvider methods={methods} onSubmit={(event) => { handleClickSubmitOpen(event) }}>
            <Grid container spacing={3}>
                <Grid container item xs={12} md={5}>
                    <RHFSelect
                        name="eaRole"
                        label="Role"
                        SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                        onChange={handleChangeeaRole}>
                        {STAFF_ROLES_OPTIONS.map((option) => (
                            <MenuItem
                                key={option.id}
                                value={option.name}
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
                                {option.name}
                            </MenuItem>
                        ))}
                    </RHFSelect>
                </Grid>


                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h5"
                            sx={{
                                mb: 2,
                                display: 'block',
                            }}>Education Admin Personal Information</Typography>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                md: 'repeat(3, 1fr)',
                            }}
                            gridTemplateAreas={{
                                xs: `"eaFirstName" "eaLastName" "eaNickname" "eaPhoneNumber" "eaLineId" "eaEmail"`,
                                md: `"eaFirstName eaLastName eaNickname" "eaPhoneNumber eaLineId eaEmail"`
                            }}
                        >
                            <Box gridArea={"eaFirstName"}>
                                <RHFTextField name="eaFirstName" label="First Name" required />
                            </Box>
                            <Box gridArea={"eaLastName"}>
                                <RHFTextField name="eaLastName" label="Last Name" required />
                            </Box>
                            <Box gridArea={"eaNickname"}>
                                <RHFTextField name="eaNickname" label="Nick Name" required />
                            </Box>
                            <Box gridArea={"eaPhoneNumber"}>
                                <RHFTextField name="eaPhoneNumber" label="Phone Number" required />
                            </Box>
                            <Box gridArea={"eaLineId"}>
                                <RHFTextField name="eaLineId" label="Line ID" required />
                            </Box>
                            <Box gridArea={"eaEmail"}>
                                <RHFTextField name="eaEmail" label="Email" required />
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={12}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center">
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ height: '3em' }}>
                            {!isEdit ? 'Create Staff' : 'Save Changes'}
                        </LoadingButton>
                    </Stack>
                </Grid>
            </Grid>
        </FormProvider>
    )
}
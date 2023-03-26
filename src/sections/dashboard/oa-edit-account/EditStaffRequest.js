import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
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
import SelectAvailableDays from './SelectAvailableDays';
import ConfirmDialog from '../../../components/confirm-dialog';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';
// ----------------------------------------------------------------------

const STAFF_ROLES_OPTIONS = [
    { id: 1, name: 'Education Admin' },
    { id: 2, name: 'Teacher' },
];

EditStaffRequest.propTypes = {
    isEdit: PropTypes.bool,
    currentStaff: PropTypes.object,
};

export default function EditStaffRequest({ isEdit = false, currentStaff, Id }) {
    const { themeStretch } = useSettingsContext();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [currentId, SetCurrentId] = useState(Id)
    const [Edit, setEdit] = useState(isEdit)

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
        eaFirstName: 'Saw',
        eaLastName: 'Zwe',
        eaNickname: 'Matt',
        eaPhoneNumber: '84688648',
        eaLineId: 'fs55s',
        eaEmail: 'saw@gmail.com',
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

    const [openCreate, setOpenCreate] = useState(false);


    const onSubmit = async (data) => {
        try {
            // updateStaff(data);
            if (isEdit) {
                await updateStaff(data);
            } else {
                await createStaff(data);
            }
            // console.log('DATA', JSON.stringify(data, null, 2));
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

    const handleOpenCreateAccount = () => {
        setOpenCreate(true);
    };

    const handleCloseCreateAccount = () => {
        setOpenCreate(false);
    };

    const handleEditAccount = () => {
        setEdit(true)
    }





    return (
        <>
            <FormProvider methods={methods} onSubmit={(event) => { handleClickSubmitOpen(event) }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <Card sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h5" sx={{ display: 'inline-block' }}>
                                    Education Student Personal Information
                                </Typography>
                                <Box >
                                    <Stack spacing={2} direction="row-reverse" justifyContent="space-between" alignItems="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 1em' }}>
                                            <Button variant="outlined" sx={{ height: '3em', width: '12em', ml: 1, color: 'black', border: '1px solid #919EAB', marginLeft: 'auto' }}>
                                                <Iconify icon="ic:vpn-key" sx={{ fontSize: 40, marginRight: 1 }} />
                                                Reset Password
                                            </Button>

                                            <Button variant="outlined" onClick={() => handleEditAccount()} sx={{ height: '3em', width: '8em', ml: 1 }}>
                                                <Iconify icon="mdi:lead-pencil" sx={{ fontSize: 40, marginRight: 1 }} />
                                                Edit
                                            </Button>
                                        </Box>

                                    </Stack>
                                </Box>

                            </Box>

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
                                    <RHFTextField disabled={!Edit} name="eaFirstName" label="First Name" required />
                                </Box>
                                <Box gridArea={"eaLastName"}>
                                    <RHFTextField disabled={!Edit} name="eaLastName" label="Last Name" required />
                                </Box>
                                <Box gridArea={"eaNickname"}>
                                    <RHFTextField disabled={!Edit} name="eaNickname" label="Nick Name" required />
                                </Box>
                                <Box gridArea={"eaPhoneNumber"}>
                                    <RHFTextField disabled={!Edit} name="eaPhoneNumber" label="Phone Number" required />
                                </Box>
                                <Box gridArea={"eaLineId"}>
                                    <RHFTextField disabled={!Edit} name="eaLineId" label="Line ID" required />
                                </Box>
                                <Box gridArea={"eaEmail"}>
                                    <RHFTextField disabled={!Edit} name="eaEmail" label="Email" required />
                                </Box>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        {Edit === false ? (
                            <>
                                <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Button type="submit" variant="outlined" onClick={() => navigate(-1)} sx={{ height: '3em', width: '8em', ml: 1, color: 'black', border: '1px solid #919EAB', marginLeft: 'auto' }}>
                                            Back
                                        </Button>
                                    </Box>
                                </Stack>
                            </>
                        ) : <Stack spacing={2} direction="row-reverse" justifyContent="space-between" alignItems="center">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 1em' }}>
                                <Button variant="outlined" onClick={() => setEdit(false)} sx={{ height: '3em', width: '8em', ml: 1, color: 'black', border: '1px solid #919EAB', marginLeft: 'auto' }}>
                                    <Iconify icon="radix-icons:cross-2" sx={{ fontSize: 40, marginRight: 1 }} />
                                    Cancel
                                </Button>

                                <Button variant="outlined" sx={{ height: '3em', width: '8em', ml: 1 }}>
                                    <Iconify icon="mdi:tick" sx={{ fontSize: 40, marginRight: 1 }} />
                                    Save
                                </Button>
                            </Box>

                        </Stack>}
                    </Grid>
                </Grid>

                <ConfirmDialog
                    open={openCreate}
                    onClose={handleCloseCreateAccount}
                    title={<>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify icon="ic:check" sx={{ fontSize: 40 }} />
                            <Typography variant='h4' sx={{ marginLeft: '1rem' }}>Create New Account</Typography>
                        </div>
                    </>}
                    content={
                        'If you submit, this  account will be create according to this information.'}
                    direction="row-reverse"
                    action={
                        <Button variant="contained" color="success">
                            Submit
                        </Button>
                    }
                />
            </FormProvider>
        </>

    )
}
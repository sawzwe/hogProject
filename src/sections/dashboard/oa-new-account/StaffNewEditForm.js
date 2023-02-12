import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState } from 'react';
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

StaffNewEditForm.propTypes = {
    isEdit: PropTypes.bool,
    currentStudent: PropTypes.object,
};

export default function StaffNewEditForm({ isEdit = false, currentStudent }) {

    return (
        <Grid>
            Hi
        </Grid>
    );
}

// ----------------------------------------------------------------

export function EANewForm() {

    const NewEASchema = Yup.object().shape({
        eaFirstName: Yup.string().required('Firstname is required'),
        eaLastName: Yup.string().required('Lastname is required'),
        eaNickname: Yup.string().required('Nickname is required'),
        eaPhoneNumber: Yup.string().required('Phone number is required'),
        eaLineId: Yup.string().required('Line ID is required'),
        eaEmail: Yup.string().email('Email is invalid').required('Email is required'),
    });

    const defaultValues = {
        eaFirstName: '',
        eaLastName: '',
        eaNickname: '',
        eaPhoneNumber: '',
        eaLineId: '',
        eaEmail: ''
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

    return (
        <FormProvider methods={methods}>
            <Button>Submit</Button>
        </FormProvider>
    )
}

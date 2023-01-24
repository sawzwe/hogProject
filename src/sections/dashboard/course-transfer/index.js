import PropTypes from 'prop-types';
import { useState, useMemo, useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Typography, Divider, Button } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import FormProvider from '../../../components/hook-form';
import Iconify from '../../../components/iconify';
//
import TransferNewEditCourse from './TransferNewEditCourse';
import TransferNewEditComment from './TransferNewEditComment';

// ----------------------------------------------------------------------

TransferNewEditForm.propTypes = {
    isEdit: PropTypes.bool,
    currentTransferRequest: PropTypes.object,
};

export default function TransferNewEditForm({ isEdit, currentTransferRequest }) {
    const navigate = useNavigate();
    const upMd = useResponsive('up', 'md');

    const NewTransferRequestSchema = Yup.object().shape({
        createDate: Yup.string().nullable().required('Create date is required'),
        dueDate: Yup.string().nullable().required('Due date is required'),
        invoiceTo: Yup.mixed().nullable().required('Invoice to is required'),
    });

    const methods = useForm({
        resolver: yupResolver(NewTransferRequestSchema)
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    return (
        <FormProvider methods={methods}>
            <Card>
                <TransferNewEditCourse />
            </Card>

            <TransferNewEditComment />
            
        </FormProvider>
    )
}
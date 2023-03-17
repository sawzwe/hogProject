import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

export default function AuthResetPasswordForm() {
    const navigate = useNavigate();
    const { changePassword, logout } = useAuthContext();

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmedNewPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);

    const ResetPasswordSchema = Yup.object().shape({
        oldPassword: Yup.string().min(6, 'Password should be at least 6 characters').required('Old Password is required'),
        newPassword: Yup.string().min(6, 'Password should be at least 6 characters').required('New Password is required'),
        confirmNewPassword: Yup.string()
            .oneOf([Yup.ref('newPassword')], 'Passwords must match')
            .required('Confirm New Password is required')
    });

    const methods = useForm({
        resolver: yupResolver(ResetPasswordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        },
    });

    const {
        reset,
        setError,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = methods;

    const onSubmit = async (data) => {
        try {
            await changePassword(data.oldPassword, data.newPassword);
            logout();
        } catch (error) {
            reset();
            if (error.message === 'Firebase: Error (auth/wrong-password).') {
                setError('afterSubmit', {
                    ...error,
                    message: 'Wrong password, please try again'
                });
            } else {
                setError('afterSubmit', {
                    ...error,
                    message: error.message
                });
            }
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
                <RHFTextField
                    name="oldPassword"
                    label="Old Password"
                    type={showOldPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                                    <Iconify icon={showOldPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <RHFTextField
                    name="newPassword"
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                    <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <RHFTextField
                    name="confirmNewPassword"
                    label="Confirm new password"
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmedNewPassword(!showConfirmNewPassword)} edge="end">
                                    <Iconify icon={showConfirmNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 3 }}>
                Change Password
            </LoadingButton>
        </FormProvider>
    );
}

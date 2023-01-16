import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import FormProvider, { RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

export default function AuthResetPasswordForm() {
    const navigate = useNavigate();
    const { changePassword, logout } = useAuthContext();

    const ResetPasswordSchema = Yup.object().shape({
        newPassword: Yup.string().required('New Password is required')
    });

    const methods = useForm({
        resolver: yupResolver(ResetPasswordSchema),
        // defaultValues: { newPassword: 'demo@minimals.cc' },
    });

    const {
        reset,
        setError,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data) => {
        try {
            await changePassword(data.newPassword);
            logout();
            navigate('/');
        } catch (error) {
            console.error(error.message);

            reset();

            setError('afterSubmit', {
                ...error,
                message: error.message
            });
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <RHFTextField name="newPassword" label="New password" />
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 3 }}>
                Change Password
            </LoadingButton>
        </FormProvider>
    );
}

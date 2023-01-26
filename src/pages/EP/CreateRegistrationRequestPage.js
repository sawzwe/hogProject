import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import * as Yup from 'yup';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Container, Typography, MenuItem, Grid } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
import FormProvider, { RHFSelect } from '../../components/hook-form';
import { FormPrivate, FormGroup, FormSemiPrivate } from '../../sections/dashboard/ep-registration-request-form';

// ----------------------------------------------------------------------

const COURSE_TYPE_OPTIONS = [
    { id: 1, name: 'Group' },
    { id: 2, name: 'Private' },
    { id: 3, name: 'Semi Private'}
]

// ----------------------------------------------------------------------

export default function CreateRegistrationRequestPage() {
    const { themeStretch } = useSettingsContext();

    const { courseType, setCourseType } = useState('');

    const RegRequestSchema = Yup.object().shape({
        selectedCourseType: Yup.string().required('Course type is required'),
    });

    const defaultValues = useMemo(
        () => ({
            selectedCourseType: '',
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(RegRequestSchema),
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

    const onSubmit = async (data) => {
        try {
            console.log('DATA', JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Helmet>
                <title> EP | Create Registration Request </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography variant="h3" component="h1" paragraph>
                    Create Registration Request
                </Typography>

                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <RHFSelect
                                name="selectedCourseType"
                                label="Course Type"
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}>
                                {COURSE_TYPE_OPTIONS.map((option) => (
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

                    { values.selectedCourseType === 'Group' && <Grid item xs={12} md={12}><FormGroup /> </Grid> }
                    { values.selectedCourseType === 'Private' && <Grid item xs={12} md={12}> <FormPrivate /> </Grid> }
                    { values.selectedCourseType === 'Semi Private' && <Grid item xs={12} md={12}> <FormSemiPrivate /> </Grid> }
                    </Grid>
                </FormProvider>

            </Container>
        </>
    );
}

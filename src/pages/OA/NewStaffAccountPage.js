import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import NewStaffAccountForm from '../../sections/dashboard/oa-new-account/NewStaffAccountForm';

// ----------------------------------------------------------------------

export default function NewAccountPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> OA | New Account </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="New Account"
                    links={[
                        { name: 'Create new account' }
                    ]}
                />

                <NewStaffAccountForm />
            </Container>
        </>
    );
}

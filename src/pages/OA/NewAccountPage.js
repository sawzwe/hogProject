import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import NewAccountForm from '../../sections/dashboard/oa-new-account/NewAccountForm';

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
                        { name: 'Account Management', href: PATH_DASHBOARD.newAccount },
                        { name: 'New Account' }
                    ]}
                />

                <NewAccountForm />
            </Container>
        </>
    );
}

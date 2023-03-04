import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Typography } from '@mui/material';
import { PATH_ACCOUNT } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import EditStaffRequest from '../../sections/dashboard/oa-edit-account/EditStaffRequest';

// ----------------------------------------------------------------------

export default function NewAccountPage() {
    const { themeStretch } = useSettingsContext();
    const { id } = useParams();
    return (
        <>
            <Helmet>
                <title> OA | Edit Account </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Edit Account"
                    links={[
                        { name: 'Account Management', href: PATH_ACCOUNT.staffManagement.searchStaff },
                        { name: 'Edit Account' }
                    ]}
                />

                <EditStaffRequest Id={id}/>
            </Container>
        </>
    );
}

import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
import { PATH_COURSE_TRANSFER } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// import RegistrationRequestStatusList from '../../sections/dashboard/ea-request-management-list/RegistrationRequestStatusList'

// ----------------------------------------------------------------------

export default function CourseTransferRequestPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> Daily Calander</title>
            </Helmet>
            <CustomBreadcrumbs
                heading="Daily Calander"
                links={[
                    {
                        name: 'All Classes',
                    }
 
                ]}
            />
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Typography >Course Transfer Details</Typography>
            </Container>
        </>
    );
}

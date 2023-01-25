import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import TransferNewEditForm from '../../sections/dashboard/ep-course-transfer-list';

// ----------------------------------------------------------------------

export default function CourseTransferRequestPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> EP | Create Course Transfer Request</title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Course Transfer Request"
                    links={[
                        {
                            name: 'Create request',
                        },
                    ]}
                />
            <TransferNewEditForm />
            </Container>
        </>
    );
}

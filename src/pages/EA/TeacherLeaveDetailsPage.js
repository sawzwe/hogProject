import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Typography } from '@mui/material';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { LeavingRequestDetails } from '../../sections/dashboard/ea-leaving-request-details';

// ----------------------------------------------------------------------

export default function TeacherLeaveDetailsPage() {
    const { themeStretch } = useSettingsContext();

    const { id } = useParams();

    return (
        <>
            <Helmet>
                <title> OA | Leaving Request Details </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                {/* <CustomBreadcrumbs
                    heading="Leaving Request Details"
                    links={[
                        {
                            name: 'Leaving Request',
                        },
                        { name: 'Request status' },
                    ]}
                /> */}
                <LeavingRequestDetails Id={id} />

            </Container>
        </>
    );
}

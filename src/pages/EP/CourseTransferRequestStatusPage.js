import { Helmet } from 'react-helmet-async';
// mui
import {Container} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import CourseTransferRequestList from '../../sections/dashboard/ep-course-transfer-list/CourseTransferRequestList';

// ----------------------------------------------------------------------

export default function CourseTransferRequestPage() {

     const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title>Course Transfe Request</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Course Transferring Request Status"
                    links={[
                        {
                            name: 'Course transferring',
                            href: PATH_DASHBOARD.courseTransferring.root,
                        },
                        { name: 'Request status' },
                    ]}
                />
                <CourseTransferRequestList/>
            </Container>
        </>
    );
}



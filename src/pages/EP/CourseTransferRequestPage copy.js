import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography,Stack,Card } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';    
// Table
// import {UserTableRow, UserTableToolbar} from './TableEA';
import UserListPage from './TableEA/UserListPage';

// ----------------------------------------------------------------------

export default function CourseTransferRequestPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
        <Helmet>
            <title>Course Transfer Request</title>
        </Helmet>
        <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="EA Table"
                    links={[
                        {
                            name: 'Student management',
                            href: PATH_DASHBOARD.firstPage,
                        },
                        { name: 'Course Transfer' },
                    ]}
                />  
                <UserListPage/>
            </Container>
        </>
    );
}

import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { PATH_ACCOUNT } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import EditStaff from '../../sections/dashboard/oa-edit-account/EditStaff';

// ----------------------------------------------------------------------

export default function NewAccountPage() {
    const { themeStretch } = useSettingsContext();
    const { id } = useParams();

    const DUMMY_STAFF = {
        id: '1',
        fName: 'Zain',
        lName: 'Janpatiew',
        nickname: 'Zain',
        phone: '081645201',
        line: 'Zn212',
        email: 'zain@hotmail.com',
        role: 'Education Admin'
    }

    return (
        <>
            <Helmet>
                <title> OA | Edit Staff Account </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Edit Staff Account"
                    links={[
                        { name: 'All Staff', href: PATH_ACCOUNT.staffManagement.searchStaff },
                        { name: `${DUMMY_STAFF.fName} ${DUMMY_STAFF.lName}`, href: `/account/staff-management/staff/${DUMMY_STAFF.id}` },
                        { name: 'Edit Account' }
                    ]}
                />

                <EditStaff currentStaff={DUMMY_STAFF} />
            </Container>
        </>
    );
}

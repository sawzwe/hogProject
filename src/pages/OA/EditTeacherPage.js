import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Typography } from '@mui/material';
import { PATH_ACCOUNT } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import EditTeacher from '../../sections/dashboard/oa-edit-account/EditTeacher';

// ----------------------------------------------------------------------

export default function NewAccountPage() {
    const { themeStretch } = useSettingsContext();
    const { id } = useParams();

    const DUMMY_TEACHER = {
        id: '1',
        fName: 'Piyaphon',
        lName: 'Wu',
        nickname: 'Hong',
        phone: '0971478523',
        line: 'hong1',
        email: 'hong@hotmail.com',
        monday: {fromTime: '09:00', toTime: '18:00'},
        tuesday: {fromTime: '09:00', toTime: '18:00'},
        wednesday: {fromTime: '09:00', toTime: '18:00'},
        thursday: {fromTime: '09:00', toTime: '18:00'},
        friday: {fromTime: '09:00', toTime: '18:00'},
        saturday: {fromTime: '', toTime: ''},
        sunday: {fromTime: '', toTime: ''}
    }

    return (
        <>
            <Helmet>
                <title> OA | Edit Teacher Account </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Edit Teacher Account"
                    links={[
                        { name: 'All Teachers', href: PATH_ACCOUNT.teacherManagement.searchTeacher },
                        { name: 'Teacher Name', href: `/account/teacher-management/teacher/${DUMMY_TEACHER.id}` },
                        { name: 'Edit Account' }
                    ]}
                />

                <EditTeacher currentTeacher={DUMMY_TEACHER} />
            </Container>
        </>
    );
}

import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import ViewTeacher from '../../sections/dashboard/oa-edit-account/ViewTeacher';
import { PATH_ACCOUNT } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function NewAccountPage() {
    const { themeStretch } = useSettingsContext();

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
                <title> OA | Teacher Information </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Teacher Information"
                    links={[
                        {
                            name: 'All Teachers',
                            href: PATH_ACCOUNT.teacherManagement.searchTeacher,
                        },
                        { name: 'Teacher name' }
                    ]}
                />

                <ViewTeacher currentTeacher={DUMMY_TEACHER} />
            </Container>
        </>
    );
}

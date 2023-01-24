import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _studentList } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import StudentNewEditForm from '../../sections/dashboard/StudentNewEditForm';

// ----------------------------------------------------------------------

export default function UserEditPage() {
    const { themeStretch } = useSettingsContext();

    const { studentId } = useParams();

    // Find user in database with user's ID
    const currentStudent = _studentList.find((student) => student.id === studentId);

    return (
        <>
            <Helmet>
                <title> Edit Student </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Edit student"
                    links={[
                        {
                            name: 'All students',
                            href: PATH_DASHBOARD.allStudents,
                        },
                        { name: currentStudent?.studentFirstName.concat(' ', currentStudent?.studentLastName) },
                    ]}
                />

                <StudentNewEditForm isEdit currentStudent={currentStudent} />
            </Container>
        </>
    );
}

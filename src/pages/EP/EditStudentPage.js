import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import StudentNewEditForm from '../../sections/dashboard/StudentNewEditForm';
import { studentList } from '../../sections/dashboard/ep-registration-request-form/_mockupData';

// ----------------------------------------------------------------------

export default function EditStudentPage() {
    const { themeStretch } = useSettingsContext();

    const { studentId } = useParams();

    // Find user in database with user's ID
    const currentStudent = studentList.find((student) => student.id === studentId);

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

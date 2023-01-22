import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _userList } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import StudentNewEditForm from '../../sections/dashboard/StudentNewEditForm';

// ----------------------------------------------------------------------

export default function UserEditPage() {
    const { themeStretch } = useSettingsContext();

    const { id } = useParams();

    // const currentUser = _userList.find((user) => paramCase(user.name) === name);

    return (
        <>
            <Helmet>
                <title> Edit Student </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <h1>ID: {id}</h1>
                {/* <CustomBreadcrumbs
                    heading="Edit user"
                    links={[
                        {
                            name: 'All students',
                            href: PATH_DASHBOARD.root,
                        },
                        { name: currentUser?.name },
                    ]}
                />

                <StudentNewEditForm isEdit currentUser={currentUser} /> */}
            </Container>
        </>
    );
}

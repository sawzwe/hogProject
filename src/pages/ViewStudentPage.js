import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// firebase
import { getStorage, ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
// @mui
import { Container, Button, Stack } from '@mui/material';
// auth
import { useAuthContext } from '../auth/useAuthContext';
// routes
import { PATH_ACCOUNT } from '../routes/paths';
// components
import LoadingScreen from '../components/loading-screen/LoadingScreen';
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
// sections
import ViewStudent from '../sections/dashboard/ViewStudent';
import { studentList } from '../sections/dashboard/ep-registration-request-form/_mockupData';

// ----------------------------------------------------------------------

export default function ViewStudentPage() {
    const { themeStretch } = useSettingsContext();
    const { id } = useParams();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const config = { headers: { Authorization: `Bearer ${user.accessToken}`} }

    const dataFetchedRef = useRef(false);

    // Firebase Storage
    const storage = getStorage();

    const [student, setStudent] = useState();
    const [avatarURL, setAvatarURL] = useState();
    const [filesURL, setFilesURL] = useState([]);

    const fetchData = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Get/${id}`, config)
            .then((res) => {
                const data = res.data.data
                setStudent(data)
                const pathReference = ref(storage, `users/students/${data.firebaseId}/Avatar/${data.profilePicture}`);
                getDownloadURL(pathReference)
                    .then((url) => setAvatarURL(url));

                const listRef = ref(storage, `users/students/${data.firebaseId}/Files`);
                listAll(listRef)
                    .then((res) => {
                        res.items.map((itemRef) => (
                            getMetadata(itemRef)
                                .then((metadata) => {
                                    getDownloadURL(itemRef)
                                        .then((url) => setFilesURL(filesURL => [...filesURL, { name: metadata.name, preview: url }]))
                                        .catch((error) => console.error(error));
                                })
                                .catch((error) => console.error(error))
                        )
                        )
                    })
            })
            .catch((error) => navigate('*', { replace: false }))
    };

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchData();
    }, []);

    if (student === undefined || !avatarURL) {
        return <LoadingScreen />;
    };

    const handleResetPassword = () => {
        console.log('Reset Password');
    };

    return (
        <>
            <Helmet>
                <title> Student Detail </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>

                <CustomBreadcrumbs
                    heading="Student Information"
                    links={[
                        {
                            name: 'All students',
                            href: PATH_ACCOUNT.studentManagement.searchStudent,
                        },
                        { name: student?.fName.concat(' ', student?.lName) },
                    ]}
                    action={
                        <>
                            <Stack direction="row" spacing={2}>
                                <Button size='large' color="inherit" variant='outlined' onClick={handleResetPassword}>Reset Password</Button>
                                <Button component={Link} to={`/account/student-management/student/${id}/edit`} size='large' variant='contained'>Edit Student</Button>

                            </Stack>
                        </>
                    }
                />

                <ViewStudent student={student} avatarURL={avatarURL} filesURL={filesURL} />
            </Container>
        </>
    );
}

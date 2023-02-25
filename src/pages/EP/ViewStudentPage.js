import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// firebase
import { getStorage, ref, getDownloadURL } from "firebase/storage";
// @mui
import { Container } from '@mui/material';
// axios
import axios from 'axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import ViewStudent from '../../sections/dashboard/ViewStudent';
import { studentList } from '../../sections/dashboard/ep-registration-request-form/_mockupData';

// ----------------------------------------------------------------------

export default function ViewStudentPage() {
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();
    const { id } = useParams();

    const [student, setStudent] = useState();
    const [avatarURL, setAvatarURL] = useState();
    const [notFound, setNotFound] = useState(false);

    // Firebase Storage
    const storage = getStorage();
    // const pathReference = ref(storage, `users/${student.firebaseId}/Avatar/${student.profilePicture}`);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Get/${id}`)
            .then((res) => {
                const data = res.data.data
                setStudent(data)
                const pathReference = ref(storage, `users/${data.firebaseId}/Avatar/${data.profilePicture}`);
                getDownloadURL(pathReference)
                .then((url) => setAvatarURL(url));
            })
            .catch((error) => navigate('*', { replace: false }))
    }, [])

    if (!student && !avatarURL) {
        return <LoadingScreen />;
    }

    console.log(student);

    return (
        <>
            <Helmet>
                <title> Student Detail </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="View student"
                    links={[
                        {
                            name: 'All students',
                            href: PATH_DASHBOARD.allStudents,
                        },
                        { name: student?.fName.concat(' ', student?.lName) },
                    ]}
                />

                <ViewStudent student={student} avatarURL={avatarURL} />
            </Container>
        </>
    );
}

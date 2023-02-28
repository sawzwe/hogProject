import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
// firebase
import { getStorage, ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
// @mui
import { Container, Button } from '@mui/material';
// axios
import axios from 'axios';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
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
    const navigate = useNavigate();
    const { id } = useParams();

    const dataFetchedRef = useRef(false);
    
    // Firebase Storage
    const storage = getStorage();

    const [student, setStudent] = useState();
    const [avatarURL, setAvatarURL] = useState();
    const [filesURL, setFilesURL] = useState([]);

    const fetchData = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Get/${id}`)
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
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchData();
    }, [])

    if (student === undefined || !avatarURL) {
        return <LoadingScreen />;
    }

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
                    action={
                        <Button component={Link} to={`/dashboard/student-management/search-student/${id}/edit`} size='large' variant='contained'>Edit Student</Button>
                    }
                />

                <ViewStudent student={student} avatarURL={avatarURL} filesURL={filesURL} />
            </Container>
        </>
    );
}

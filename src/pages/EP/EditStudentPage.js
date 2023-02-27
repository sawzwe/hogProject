import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
// firebase
import { getStorage, ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
// @mui
import { Container } from '@mui/material';
// axios
import axios from 'axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
import StudentNewEditForm from '../../sections/dashboard/StudentNewEditForm';
import { studentList } from '../../sections/dashboard/ep-registration-request-form/_mockupData';

// ----------------------------------------------------------------------

export default function EditStudentPage() {
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();
    const { id } = useParams();

    const dataFetchedRef = useRef(false);

    const storage = getStorage();

    const [student, setStudent] = useState();
    const [avatarURL, setAvatarURL] = useState();
    const [filesURL, setFilesURL] = useState([]);

    const fetchData = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Student/Get/${id}`)
            .then((res) => {
                const data = res.data.data
                setStudent(data)
                const pathReference = ref(storage, `users/${data.firebaseId}/Avatar/${data.profilePicture}`);
                getMetadata(pathReference)
                    .then((metadata) => {
                        getDownloadURL(pathReference)
                            .then((url) => setAvatarURL({ name: metadata.name, type: metadata.contentType, size: metadata.size, preview: url }));
                    })

                const listRef = ref(storage, `users/${data.firebaseId}/Files`);
                listAll(listRef)
                    .then((res) => {
                        res.items.map((itemRef) => (
                            // getDownloadURL(itemRef)
                            //     .then((url) => setFilesURL(filesURL => [...filesURL, url]))
                            getMetadata(itemRef)
                                .then((metadata) => {
                                    getDownloadURL(itemRef)
                                        .then((url) => setFilesURL(filesURL => [...filesURL, { name: metadata.name, ref: itemRef, preview: url }]))
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

    console.log(filesURL)

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
                            href: PATH_DASHBOARD.studentManagement.searchStudent,
                        },
                        { name: student?.fName.concat(' ', student?.lName) },
                    ]}
                />

                <StudentNewEditForm isEdit currentStudent={student} currentAvatar={avatarURL} currentFiles={filesURL} />
            </Container>
        </>
    );
}

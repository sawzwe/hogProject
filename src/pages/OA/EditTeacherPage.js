import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
// @mui
import axios from 'axios';
import { Container } from '@mui/material';
import { PATH_ACCOUNT } from '../../routes/paths';
// components
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import EditTeacher from '../../sections/dashboard/oa-edit-account/EditTeacher';

// ----------------------------------------------------------------------

export default function NewAccountPage() {
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();
    const { id } = useParams();


    const dataFetchedRef = useRef(false);

    const [teacher, setTeacher] = useState();


    const fetchData = async () => {
        return axios.get(`${process.env.REACT_APP_HOG_API}/api/Teacher/Get/${id}`)
            .then((res) => {
                console.log('res', res);
                const data = res.data.data.fullName
                setTeacher(data)
                // console.log('data', data)
            })
            .catch((error) => navigate('*', { replace: false }))
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        fetchData();
        dataFetchedRef.current = true;
    }, [])

    const DUMMY_TEACHER = {
        id: '1',
        role: 'Teacher',
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
                        { name: `${teacher}` },
                        { name: 'Edit Account' }
                    ]}
                />

                <EditTeacher currentTeacher={DUMMY_TEACHER} />
            </Container>
        </>
    );
}

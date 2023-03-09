import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
// @mui
import { Container } from '@mui/material';
import axios from 'axios';
// components
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import ViewTeacher from '../../sections/dashboard/oa-edit-account/ViewTeacher';
import { PATH_ACCOUNT } from '../../routes/paths';

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
                const data = res.data.data
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

    if (teacher === undefined){
        return <LoadingScreen/>
    }

    // const DUMMY_TEACHER = {
    //     id: teacher.id,
    //     role: 'Teacher',
    //     fullname: teacher.fullName,
    //     fName: teacher.fName,
    //     lName: teacher.lName,
    //     nickname: teacher.nickname,
    //     phone: teacher.phone,
    //     line: teacher.line,
    //     email: teacher.email,
    //     monday: {fromTime: '09:00', toTime: '18:00'},
    //     tuesday: {fromTime: '09:00', toTime: '18:00'},
    //     wednesday: {fromTime: '09:00', toTime: '18:00'},
    //     thursday: {fromTime: '09:00', toTime: '18:00'},
    //     friday: {fromTime: '09:00', toTime: '18:00'},
    //     saturday: {fromTime: '', toTime: ''},
    //     sunday: {fromTime: '', toTime: ''}
    // }
    const DUMMY_TEACHER = {
        id: '1',
        role: 'Teacher',
        fullname: teacher.fullName,
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
                        { name: `${DUMMY_TEACHER.fullname}` },
                    ]}
                />

                <ViewTeacher currentTeacher={DUMMY_TEACHER} />
            </Container>
        </>
    );
}

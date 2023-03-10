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

    const TEACHER_DATA = {
        id: teacher.id,
        role: 'Teacher',
        fullname: teacher.fullName,
        fName: teacher.fName,
        lName: teacher.lName,
        nickname: teacher.nickname,
        phone: teacher.phone,
        line: teacher.line,
        email: teacher.email,
        monday: {fromTime: teacher.workTimes[0].fromTime, toTime: teacher.workTimes[0].toTime},
        tuesday: {fromTime: teacher.workTimes[1].fromTime, toTime: teacher.workTimes[1].toTime},
        wednesday: {fromTime: teacher.workTimes[2].fromTime, toTime: teacher.workTimes[2].toTime},
        thursday: {fromTime: teacher.workTimes[3].fromTime, toTime: teacher.workTimes[3].toTime},
        friday: {fromTime: teacher.workTimes[4].fromTime, toTime: teacher.workTimes[4].toTime},
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
                        { name: `${TEACHER_DATA.fullname}` },
                        { name: 'Edit Account' }
                    ]}
                />

                <EditTeacher currentTeacher={TEACHER_DATA} />
            </Container>
        </>
    );
}

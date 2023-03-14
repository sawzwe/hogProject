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
                console.log('data', data)
            })
            .catch((error) => navigate('*', { replace: false }))
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        fetchData();
        dataFetchedRef.current = true;
    }, [])

    if (teacher === undefined) {
        return <LoadingScreen />
    }

    const TEACHER_DATA = {
        id: teacher.id.toString(),
        role: 'Teacher',
        fullname: teacher.fullName,
        fName: teacher.fName,
        lName: teacher.lName,
        nickname: teacher.nickname,
        phone: teacher.phone,
        line: teacher.line,
        email: teacher.email,
        workTimes: (() => {
            const workTimes = {
              monday: {
                fromTime:  '',
                toTime:      ''
              },
                tuesday:  {
                  fromTime:   '',
                  toTime:      ''
                },
                wednesday:  {
                  fromTime:   '',
                  toTime:      ''
                },
                thursday:  {
                  fromTime:   '',
                  toTime:  ''
                },
                friday:  {
                  fromTime:   '',
                  toTime:     ''
                },
                saturday:  {
                  fromTime:   '',
                  toTime:     ''
                },
                sunday:  {
                  fromTime:  '',
                  toTime:     ''
                },
            };

            teacher.workTimes.forEach((workTime) => {
                switch (workTime.day) {
                    case 'monday':
                        workTimes.monday = {
                            fromTime: workTime.fromTime || '',
                            toTime: workTime.toTime || '',
                        };
                        break;
                    case 'tuesday':
                        workTimes.tuesday = {
                            fromTime: workTime.fromTime || '',
                            toTime: workTime.toTime || '',
                        };
                        break;
                    case 'wednesday':
                        workTimes.wednesday = {
                            fromTime: workTime.fromTime || '',
                            toTime: workTime.toTime || '',
                        };
                        break;
                    case 'thursday':
                        workTimes.thursday = {
                            fromTime: workTime.fromTime || '',
                            toTime: workTime.toTime || '',
                        };
                        break;
                    case 'friday':
                        workTimes.friday = {
                            fromTime: workTime.fromTime || '',
                            toTime: workTime.toTime || '',
                        };
                        break;
                    case 'saturday':
                        workTimes.saturday = {
                            fromTime: workTime.fromTime || '',
                            toTime: workTime.toTime || '',
                        };
                        break;
                    case 'sunday':
                        workTimes.sunday = {
                            fromTime: workTime.fromTime || '',
                            toTime: workTime.toTime || '',
                        };
                        break;
                    default:
                        break;
                }
            });
            return workTimes;
        })(),
    };


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
                        { name: `${TEACHER_DATA.fullname}` },
                    ]}
                />

                <ViewTeacher currentTeacher={TEACHER_DATA} />
            </Container>
        </>
    );
}

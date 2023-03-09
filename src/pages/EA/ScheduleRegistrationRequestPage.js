import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// @mui
import { Container, Typography } from '@mui/material';
import { PATH_REGISTRATION } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import LoadingScreen from '../../components/loading-screen';
// sections
import Page404 from '../Page404';
import ScheduleRegistrationRequest from '../../sections/dashboard/ea-registration-request-form/ScheduleRegistrationRequest'
//
import { HOG_API } from '../../config';

// ----------------------------------------------------------------------

const MOCKUP_GROUP_REQUEST = {
    regRequestId: '1',
    courseType: 'Group',
    students: [{ id: '1', fName: 'Piyaphon', lName: 'Wu', nickname: 'Hong' }],
    courses: [
        {
            course: 'SAT',
            section: 'CY/123',
            subjects: ['Math', 'English'],
            level: 'INTENSIVE',
            method: 'Onsite',
            startDate: '1-Jan-2023',
            endDate: '14-Jan-2023'
        },
        {
            course: 'GED',
            section: 'CY/123',
            subjects: ['Math'],
            level: 'REGULAR',
            method: 'Onsite',
            startDate: '15-Jan-2023',
            endDate: '31-Jan-2023'
        }
    ],
    attachedPayment: [],
    additionalComment: '✌ Greeting from Education Planner.',
    rejectedReason: '',
    status: 'Pending OA'
}

const MOCKUP_PRIVATE_REQUEST = {
    regRequestId: '2',
    courseType: 'Private',
    students: [{ id: '1', fName: 'Piyaphon', lName: 'Wu', nickname: 'Hong' }],
    courses: [
        {
            course: 'SAT',
            section: 'Hong',
            subject: '',
            level: 'INTENSIVE',
            totalHours: '20',
            method: 'Onsite',
            hoursPerClass: '2',
            startDate: '1-Jan-2023',
            endDate: '14-Jan-2023',
            availableDays: [
                { day: 'Monday', from: '15:00', to: '18:00' },
                { day: 'Tuesday', from: '15:00', to: '18:00' },
                { day: 'Wednesday', from: '15:00', to: '18:00' },
                { day: 'Thursday', from: '15:00', to: '18:00' },
                { day: 'Friday', from: '15:00', to: '18:00' }
            ]
        },
        {
            course: 'SAT',
            section: 'Hong',
            subject: 'ENGLISH',
            level: 'REGULAR',
            totalHours: '20',
            method: 'Online',
            hoursPerClass: '2',
            startDate: '15-Jan-2023',
            endDate: '31-Jan-2023',
            availableDays: [{ day: 'Monday', from: '9:00', to: '18:00' }, { day: 'Wednesday', from: '9:00', to: '18:00' }]
        }
    ],
    attachedPayment: [],
    additionalComment: '✌ Greeting from Education Planner.',
    rejectedReason: 'There is no available time slot 🤪',
    status: 'Rejected'
}

// ----------------------------------------------------------------------

export default function StaffRequestPage() {
    const { themeStretch } = useSettingsContext();
    const navigate = useNavigate();
    const { id } = useParams();

    const [currentRequest, setCurrentRequest] = useState();
    const dataFetchedRef = useRef(false);

    const fetchRequest = () => {
        axios.get(`${HOG_API}/api/PrivateRegistrationRequest/Request/Get/${id}`)
        .then((res) => setCurrentRequest(res.data.data))
        .catch((error) => {
            if (error.response.status === 404) {
                navigate('/404')
            }
        })
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchRequest();
    }, [])

    if (currentRequest === undefined) {
        return <LoadingScreen />;
    }

    // const currentRequest = _regRequests.find((request) => request.id === requestId);
    // const currentRequest = MOCKUP_GROUP_REQUEST;
    // const currentRequest = MOCKUP_PRIVATE_REQUEST;

    return (
        <>
            <Helmet>
                <title> EA | Request Detail </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Request Information"
                    links={[
                        {
                            name: 'All requests',
                            href: PATH_REGISTRATION.eaRequestStatus,
                        },
                        { name: 'Request detail' },
                    ]}
                />
                <ScheduleRegistrationRequest currentRequest={currentRequest} />
            </Container>
        </>
    );
}

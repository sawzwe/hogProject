import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// @mui
import { Container } from '@mui/material';
import { PATH_REGISTRATION } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import LoadingScreen from '../../components/loading-screen';
// sections
import RegistrationRequestDetail from '../../sections/dashboard/ep-registration-request-form/RegistrationRequestDetail'
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
    paymentType: 'Complete Payment',
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
            section: '',
            subjects: 'MATH',
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
            section: '',
            subjects: 'ENGLISH',
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
    paymentType: 'Complete Payment',
    additionalComment: '✌ Greeting from Education Planner.',
    rejectedReason: 'There is no available time slot 🤪',
    status: 'Pending Payment'
}

// ----------------------------------------------------------------------

export default function RegistrationRequestDetailPage() {
    const { themeStretch } = useSettingsContext();
    const { id } = useParams();

    const [currentRequest, setCurrentRequest] = useState();
    const [currentSchedule, setCurrentSchedule] = useState();
    const dataFetchedRef = useRef(false);

    const fetchRequest = () => {
        axios.get(`${HOG_API}/api/PrivateRegistrationRequest/Get/${id}`)
            .then((res) => setCurrentRequest(res.data.data))
            .catch((error) => console.error(error))
    };

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchRequest();
    }, [])

    if (currentRequest === undefined) {
        return <LoadingScreen />
    }

    const currentMockRequest = (id === '1') ? MOCKUP_GROUP_REQUEST : MOCKUP_PRIVATE_REQUEST;

    return (
        <>
            <Helmet>
                <title> EP | Request Detail </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Course Registration"
                    links={[
                        { name: 'All Requests', href: PATH_REGISTRATION.epRequestStatus },
                        { name: 'Request Detail' }
                    ]}
                />

                <RegistrationRequestDetail currentRequest={currentRequest} />
            </Container>
        </>
    );
}
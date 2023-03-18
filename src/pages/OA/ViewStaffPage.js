import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// @mui
import { Container } from '@mui/material';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import ViewStaff from '../../sections/dashboard/oa-edit-account/ViewStaff';
import { PATH_ACCOUNT } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function NewAccountPage() {
    const { themeStretch } = useSettingsContext();
    const { role, id } = useParams();
    const [currentStaff, setCurrentStaff] = useState();
    const dataFetchedRef = useRef(false);

    const fetchData = () => {
        axios.get('')
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchData();
    }, [])

    const DUMMY_STAFF = {
        id: '1',
        fName: 'Zain',
        lName: 'Janpatiew',
        nickname: 'Zain',
        phone: '081645201',
        line: 'Zn212',
        email: 'zain@hotmail.com',
        role: 'Education Admin'
    }

    return (
        <>
            <Helmet>
                <title> OA | Staff Information </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Staff Information"
                    links={[
                        {
                            name: 'All Staffs',
                            href: PATH_ACCOUNT.staffManagement.searchStaff,
                        },
                        { name: `${DUMMY_STAFF.fName} ${DUMMY_STAFF.lName}` }
                    ]}
                />

                <ViewStaff currentStaff={DUMMY_STAFF} />
            </Container>
        </>
    );
}

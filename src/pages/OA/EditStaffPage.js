import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// @mui
import { Container } from '@mui/material';
import { PATH_ACCOUNT } from '../../routes/paths';
// components
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import EditStaff from '../../sections/dashboard/oa-edit-account/EditStaff';
import { HOG_API } from '../../config';

// ----------------------------------------------------------------------

export default function NewAccountPage() {
    const { themeStretch } = useSettingsContext();
    const { role, id } = useParams();
    const [currentStaff, setCurrentStaff] = useState();
    const [currentRole, setCurrentRole] = useState("");
    const dataFetchedRef = useRef(false);

    const fetchData = async () => {
        await axios.get(`${HOG_API}/api/Staff/Get/${id}`)
            .then((res) => setCurrentStaff(res.data.data))
            .catch((error) => console.error(error))
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchData();
    }, [])

    if (currentStaff === undefined) {
        return <LoadingScreen />
    }

    return (
        <>
            <Helmet>
                <title> OA | Edit Staff Account </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CustomBreadcrumbs
                    heading="Edit Staff Account"
                    links={[
                        { name: 'All Staff', href: PATH_ACCOUNT.staffManagement.searchStaff },
                        { name: `${currentStaff.fullName}`, href: `/account/staff-management/staff/${currentStaff.id}` },
                        { name: 'Edit Account' }
                    ]}
                />

                <EditStaff currentStaff={currentStaff} />
            </Container>
        </>
    );
}

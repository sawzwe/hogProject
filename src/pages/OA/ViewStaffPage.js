import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// @mui
import { Container } from '@mui/material';
// components
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import ViewStaff from '../../sections/dashboard/oa-edit-account/ViewStaff';
import { PATH_ACCOUNT } from '../../routes/paths';
import { HOG_API } from '../../config';

// ----------------------------------------------------------------------

export default function NewAccountPage() {
    const { themeStretch } = useSettingsContext();
    const { role, id } = useParams();
    const [currentStaff, setCurrentStaff] = useState();
    const [currentRole, setCurrentRole] = useState("");
    const dataFetchedRef = useRef(false);

    const fetchData = async () => {

        try {
            if (role === 'ep') {
                await axios.get(`${HOG_API}/api/EP/Get/${id}`)
                    .then((res) => {
                        setCurrentStaff(res.data.data)
                        setCurrentRole('ep')
                    })
                    .catch((error) => {
                        throw error;
                    })
            }
            if (role === 'ea') {
                await axios.get(`${HOG_API}/api/EA/Get/${id}`)
                    .then((res) => {
                        setCurrentStaff(res.data.data)
                        setCurrentRole('ea')
                    })
                    .catch((error) => {
                        throw error;
                    })
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchData();
    }, [])

    if (currentStaff === undefined) {
        return <LoadingScreen />
    }

    // console.log(currentStaff, currentRole);

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
                        { name: `${currentStaff.fullName}` }
                    ]}
                />

                <ViewStaff currentStaff={currentStaff} currentRole={currentRole} />
            </Container>
        </>
    );
}

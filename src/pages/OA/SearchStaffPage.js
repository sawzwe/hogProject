import { Helmet } from 'react-helmet-async';
import { useState, useEffect,useRef } from 'react';
// @mui
import { Card, Container, Stack } from '@mui/material';
// components
import axios from 'axios';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
// routes
import { PATH_ACCOUNT } from '../../routes/paths';
// Table
import StaffList from '../../sections/dashboard/oa-all-staff-list/StaffList';
// API
import { HOG_API } from '../../config';

// ----------------------------------------------------------------------

export default function SearchStaffPage() {
    const { themeStretch } = useSettingsContext();

    const dataFetchedRef = useRef(false);
    const [epStaff, setEpStaff] = useState();
    const [eaStaff, setEaStaff] = useState();
    const [allStaffs, setAllStaffs] = useState();

    const fetchDataEP = async () => {
        return axios.get(`${HOG_API}/api/EP/Get`)
            .then(response => {
                return response.data.data;
            })
            .catch(error => {
                console.log(error);
            });
    }
    
    const fetchDataEA = async () => {
        return axios.get(`${HOG_API}/api/EA/Get`)
            .then(response => {
                return response.data.data;
            })
            .catch(error => {
                console.log(error);
            });
    }
    
    useEffect(() => {
        Promise.all([fetchDataEP(), fetchDataEA()])
            .then(([epStaff, eaStaff]) => {
                setAllStaffs([...epStaff, ...eaStaff]);
                setEpStaff(epStaff);
                setEaStaff(eaStaff);
                // console.log(allStaffs);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    if (epStaff === undefined || eaStaff === undefined) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Helmet>
                <title>All Staff</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                    heading="All Staff"
                    links={[
                        { name: 'All Staff', href: PATH_ACCOUNT.staffManagement.searchStaff },
                        { name: 'Edit Account' }
                    ]}
                />
                <Stack spacing={3}>
                    <Card>
                        {/* <StaffList/> */}
                        <StaffList allStaffs={allStaffs} />
                    </Card>
                </Stack>
            </Container>
        </>
    );
}

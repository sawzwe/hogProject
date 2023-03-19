import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from 'react';
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

    // const fetchDataEP = async () => {
    //     await axios.get(`${HOG_API}/api/EP/Get`)
    //         .then(response => {
    //             console.log('ep', response)
    //             setAllStaffs([...allStaffs, ...response.data.data])
    //             setEpStaff(response.data.data)
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });
    // }

    const fetchData = async () => {
        await axios.get(`${HOG_API}/api/EP/Get`)
            .then(async (resEP) => {
                const allEPs = resEP.data.data
                const formattedEPs = allEPs.map((ep) => ({
                    id: ep.id,
                    fName: ep.fName,
                    lName: ep.lName,
                    email: ep.email,
                    firebaseId: ep.firebaseId,
                    fullName: ep.fullName,
                    nickname: ep.nickname,
                    line: ep.line,
                    phone: ep.phone,
                    role: "EP"
                }))
                await axios.get(`${HOG_API}/api/EA/Get`)
                    .then(resEA => {
                        const allEAs = resEA.data.data
                        const formattedEAs = allEAs.map((ea) => ({
                            id: ea.id,
                            fName: ea.fName,
                            lName: ea.lName,
                            email: ea.email,
                            firebaseId: ea.firebaseId,
                            fullName: ea.fullName,
                            nickname: ea.nickname,
                            line: ea.line,
                            phone: ea.phone,
                            role: "EA"
                        }))
                        setAllStaffs([...formattedEPs, ...formattedEAs])
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                console.log(error);
            });

    }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetchData()
    }, []);

    if (allStaffs === undefined) {
        return <LoadingScreen />;
    }

    // console.log(allStaffs)

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

import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Container, Typography, TextField, InputAdornment,Button, } from '@mui/material';
import axios from 'axios';
// components
import { useSettingsContext } from '../../components/settings';
import { HOG_API } from '../../config';
// ----------------------------------------------------------------------
import Iconify from '../../components/iconify';

export default function DailyCalendarPage() {


    // useEffect(() => {

    //     const header =
    //         // axios({
    //         //     method: 'put',
    //         //     url: 'https://houseofgriffin-api-stg.azurewebsites.net/api/Student/Put',
    //         //     data: {
    //         //         id: 1,
    //         //         title: 'Ms.',
    //         //         fName: 'Piyaon',
    //         //         lName: 'Wu',
    //         //         nickname: 'Hong',
    //         //         dob: '23-Feb-2022',
    //         //         email: 'hong@hotmail.com',
    //         //         phone: '0973574151',
    //         //         school: 'Assumption Rayong',
    //         //         countryOfSchool: 'Thailand',
    //         //         levelOfStudy: 'Matthayom 6',
    //         //         line: 'pnw029',
    //         //         program: 'Thai program'
    //         //     }
    //         // }).then((response) => console.log(response)).catch((error) => console.log(error));

    //         // axios.post(`${HOG_API}/api/Student/Post`, {
    //         //     title: 'Mr.',
    //         //     fName: 'SawZwe',
    //         //     lName: 'WaiYan',
    //         //     nickname: 'Saw',
    //         //     dob: '26-Mar-2022',
    //         //     email: 'saw@hotmail.com',
    //         //     phone: '0978486',
    //         //     school: 'Assumption Rayong',
    //         //     countryOfSchool: 'Thailand',
    //         //     levelOfStudy: 'Matthayom 6',
    //         //     line: 'pnw029',
    //         //     program: 'Thai program'
    //         // })
    //         //     .then((response) => {
    //         //         console.log(response);
    //         //     })
    //         //     .catch((error) => {
    //         //         console.log(error);
    //         //     });

    //         // axios.get('${HOG_API}/api/Student/Get/1')
    //         // .then((res) => console.log(res.data))

    //         // axios.delete(`${HOG_API}/api/Student/Delete/${id}`)
    //         //     .then(res => {
    //         //         console.log(res);
    //         //         console.log(res.data);
    //         //     })

    // }, [])

    const { themeStretch } = useSettingsContext();
    const [data, setData] = useState([])

    const [filterName, setFilterName] = useState('');


    const onFilterName = (e) => {
        console.log(e.target.value)
        setFilterName(e.target.value);
    };

    useEffect(() => {
        axios.get(`${HOG_API}/api/Student/Get`)
            .then(res => {
                const data = res.data
                // console.log(data)
                setData(data)
            }).catch(err => {
                console.error(err)
            })
    }, [])

    const deleteData = (id) => {
        axios.delete(`${HOG_API}/api/Student/Delete/${id}`)
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
    };
    
    return (
        <>
            <Helmet>
                <title> EA | Daily Calendar </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                <TextField
                    fullWidth
                    value={filterName}
                    onChange={onFilterName}
                    placeholder="Set ID"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                        ),
                    }}
                    
                />
                <Button variant='contained' onClick={()=>deleteData(filterName)}>Delete Data</Button>
            </Container>
        </>
    );
}

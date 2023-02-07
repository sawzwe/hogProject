import { Helmet } from 'react-helmet-async';
import {useEffect,useState} from 'react'
import axios from 'axios';
// @mui
import { Container, Typography,Button } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
import { HOG_API } from '../../config';


// ----------------------------------------------------------------------

export default function DailyCalendarPage() {
    const { themeStretch } = useSettingsContext();
    const [data,setData] = useState([])
    console.log(HOG_API)

    useEffect(() => {
        axios.get(`${HOG_API}/api/Student/Get`)
        .then( res => {
            const data = res.data
            console.log(data)
            setData(data)
        }).catch(err => {
            console.error(err)
        })
    }, [])

    return (
        <>
            <Helmet>
                <title> EA | Daily Calendar </title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'xl'}>
                {/* <ul>
                    {
                        data.map(data =>
                        <li key={data.id}>{data.fName}</li>)
                    }
                </ul> */}
            </Container>
        </>
    );
}

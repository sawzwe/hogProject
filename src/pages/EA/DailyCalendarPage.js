import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
// @mui
import { Container, Typography } from '@mui/material';
import axios from 'axios';
// components
import { useSettingsContext } from '../../components/settings';
import { HOG_API } from '../../config';
// ----------------------------------------------------------------------

export default function DailyCalendarPage() {

    console.log('render')

    useEffect(() => {
        
        // const header 

        fetch('https://houseofgriffin-api-stg.azurewebsites.net/api/Student/Get', {
            method: 'GET',
            headers: {},
            credentials: 'include'
        })
    }, [])

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

import { Helmet } from 'react-helmet-async';
import { useEffect,useState } from 'react';
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
        // axios({
        //     method: 'put',
        //     url: 'https://houseofgriffin-api-stg.azurewebsites.net/api/Student/Put',
        //     data: {
        //         id: 1,
        //         title: 'Ms.',
        //         fName: 'Piyaon',
        //         lName: 'Wu',
        //         nickname: 'Hong',
        //         dob: '23-Feb-2022',
        //         email: 'hong@hotmail.com',
        //         phone: '0973574151',
        //         school: 'Assumption Rayong',
        //         countryOfSchool: 'Thailand',
        //         levelOfStudy: 'Matthayom 6',
        //         line: 'pnw029',
        //         program: 'Thai program'
        //     }
        // }).then((response) => console.log(response)).catch((error) => console.log(error));

        // axios.post('https://houseofgriffin-api-stg.azurewebsites.net/api/Student/Post', {
        //     title: 'Mr.',
        //     fName: 'Piyaphon',
        //     lName: 'Wu',
        //     nickname: 'Hong',
        //     dob: '23-Feb-2022',
        //     email: 'hong@hotmail.com',
        //     phone: '0973574151',
        //     school: 'Assumption Rayong',
        //     countryOfSchool: 'Thailand',
        //     levelOfStudy: 'Matthayom 6',
        //     line: 'pnw029',
        //     program: 'Thai program',
        //     address: '5/89 Hong Baker Street, Hongland',
        //     parent: 'Mr. Daddy Hong'
        // })
        //     .then((response) => {
        //         console.log(response);
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });

        // axios.get('https://houseofgriffin-api-stg.azurewebsites.net/api/Student/Get/1')
        // .then((res) => console.log(res.data))

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

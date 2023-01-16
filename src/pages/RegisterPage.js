import { Helmet } from 'react-helmet-async';
// sections
import Register from '../sections/auth/Register';
// import Login from '../../sections/auth/LoginAuth0';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
    return (
        <>
            <Helmet>
                <title> Register | Minimal UI</title>
            </Helmet>

            <Register />
        </>
    );
}

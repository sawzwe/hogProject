import { m } from 'framer-motion';
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Typography, Container } from '@mui/material';
// components
import { MotionContainer, varBounce } from './animate';
// assets
import { PageNotFoundIllustration } from '../assets/illustrations';

// ----------------------------------------------------------------------

NotFound.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    action: PropTypes.string,
}

export default function NotFound({ title, message, action }) {
    return (
        <>

            <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
                <m.div variants={varBounce().in}>
                    <Typography variant="h3" paragraph>
                        {title}
                    </Typography>
                </m.div>

                <m.div variants={varBounce().in}>
                    <Typography sx={{ color: 'text.secondary' }}>
                        {message}
                    </Typography>
                </m.div>

                <m.div variants={varBounce().in}>
                    <PageNotFoundIllustration
                        sx={{
                            height: 260,
                            my: { xs: 5, sm: 10 },
                        }}
                    />
                </m.div>

                <Button to={-1} component={RouterLink} size="large" variant="contained">
                    {action}
                </Button>
            </Container>
        </>
    );
}

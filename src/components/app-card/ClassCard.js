import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardContent, Grid, Typography, Box, Button, Divider } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

ClassCard.propTypes = {
    schedule: PropTypes.object,
};

export default function ClassCard({ schedule }) {

    const {
        classId,
        subject,
        from,
        to,
        room,
        teacher
    } = schedule

    return (
        <Grid container sx={{ my: 2 }}>
            <Box display="inline-block" sx={{ width: '100%' }}>
                <Card variant="outlined" sx={{ borderRadius: 1, boxShadow: 0 }}>
                    <CardContent sx={{ pb: 2 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                            {from} - {to}
                        </Typography>
                        <Typography color="text.secondary">
                            {subject}
                        </Typography>
                        <Typography color="text.secondary">
                            {!!room && `R.${room} | `} {teacher}
                        </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button
                            fullWidth
                            size="medium"
                            endIcon={<NavigateNextIcon />}
                            sx={{ justifyContent: "flex-start", pl: 2 }}>
                            Course detail
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Grid>
    )
}
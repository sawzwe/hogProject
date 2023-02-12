import { useState } from 'react';
// @mui
import { TextField, Card, CardActions, CardContent, Grid, Typography, Box, Button, Divider, InputAdornment } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import EventIcon from '@mui/icons-material/Event';
// hooks
import useResponsive from '../../../hooks/useResponsive';

export default function StudentCalendar() {

    const isDesktop = useResponsive('up', 'lg');

    const today = new Date(2023, 2, 13)
    const [value, setValue] = useState(today);

    return (
        <>
            {isDesktop ? (
                <DesktopDatePicker
                    value={value}
                    onChange={(newValue) => {
                        setValue(newValue);
                    }}
                    minDate={today}
                    renderInput={(params) => <TextField {...params} />}
                    disableMaskedInput
                    inputFormat="dd MMMM yyyy"
                />
            ) : (
                <MobileDatePicker
                    value={value}
                    onChange={(newValue) => {
                        setValue(newValue);
                    }}
                    minDate={today}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <EventIcon />
                            </InputAdornment>
                        ),
                    }}
                    disableMaskedInput
                    inputFormat="dd MMMM yyyy"
                />
            )}

            <Grid container sx={{ my: 2 }}>
                <Box display="inline-block" sx={{ width: '100%' }}>
                    <Card variant="outlined" sx={{ borderRadius: 1, boxShadow: 0 }}>
                        <CardContent sx={{ pb: 2 }}>
                            <Typography variant="h5" component="div" gutterBottom>
                                10:00 - 12:00
                            </Typography>
                            <Typography color="text.secondary">
                                {`SAT MATH (PRIVATE)`}
                            </Typography>
                            <Typography color="text.secondary">
                                R.306 | Kiratijuta Bhumichitr
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
        </>
    )
}

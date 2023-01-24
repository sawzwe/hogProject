import { Grid, Card, Typography } from '@mui/material';
import { RHFTextField } from '../../../components/hook-form';

export default function TransferNewEditComment() {
    return (
        <Grid item xs={12} md={12}>
            <Card sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5"
                    sx={{
                        size: 'large',
                        mb: 2,
                        display: 'block',
                    }}>
                    Additional Comment
                </Typography>
                <RHFTextField name="commentEP" placeholder="Comment to Education Admin" />
            </Card>
        </Grid>
    )
}
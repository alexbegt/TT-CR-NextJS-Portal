import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Image from 'next/image';

import { useRouter } from "next/router";
import CardActions from '@mui/material/CardActions';

export default function UnavailableBody() {
    const router = useRouter();

    return (
        <div>
            <Grid container spacing={4} justifyContent="center" columns={12}>
                <Grid item xs={12} sm={12} md={12}>
                    <Card elevation={10}>
                        <CardContent>
                            <Grid item container spacing={2} justifyContent="center">
                                <Image
                                    src={'/technical_difficulties.jpg'}
                                    width={940}
                                    height={705}
                                    alt={'System down'} />
                            </Grid>
                        </CardContent>

                        <CardContent>
                            <Grid item container spacing={2}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <CardHeader
                                        titleTypographyProps={{ fontWeight: 'bold', fontSize: 35, textAlign: 'center', float: 'center' }}
                                        title="System is unavailable, please try again later."
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} hidden={!router.query?.error}>
                                    <Typography
                                        sx={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}
                                    >
                                        Error Code: {router.query?.error}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={12} md={12}>
                                    <CardActions sx={{ justifyContent: 'center' }}>
                                        <Button
                                            variant="contained"
                                            onClick={() => { router.push(process.env.CODE_REDEMPTION_MAIN_MENU) }}
                                            style={{ float: 'left', marginTop: '10px' }}
                                        >
                                            Return to Main Menu
                                        </Button>
                                    </CardActions>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}
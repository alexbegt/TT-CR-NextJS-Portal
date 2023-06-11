import Button from '@mui/material/Button';

import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';

import { useRouter } from "next/router";

import sharedStyles from '@/styles/shared.module.scss';

export default function Home() {
    const router = useRouter();

    return (
        <div className={sharedStyles.container}>
            <Box className={sharedStyles.formPage}>
                <Grid container spacing={4} justifyContent="center" columns={12}>
                    <Grid item xs={12} sm={12} md={12}>
                        <Card elevation={10} className={sharedStyles.card}>
                            <CardContent>
                                <Grid item container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <CardHeader
                                            titleTypographyProps={{ fontWeight: 'bold', fontSize: 18, textAlign: 'left', float: 'left' }}
                                            title="Code Redemption Menu"
                                            style={{ width: '80%', float: 'left' }}
                                        />

                                        <Button
                                            variant="contained"
                                            onClick={() => { router.push(process.env.CODE_REDEMPTION_MAIN_MENU) }}
                                            style={{ float: 'left', marginTop: '10px' }}
                                        >
                                            Navigate
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box >
        </div >
    )
}
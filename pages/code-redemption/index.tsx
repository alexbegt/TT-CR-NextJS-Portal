import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';

import { useRouter } from "next/router";
import Image from 'next/image';

import axios from "axios";

import { GenericResponse, ResponseError } from '@/components/helpers/ResponseHelpers';
import PageHeader from '@/components/PageHeader/PageHeader';

import sharedStyles from '@/styles/shared.module.scss';

export default function CodeRedemptionIndex({ hasLots }: { hasLots: boolean }) {
    const router = useRouter();

    return (
        <div className={sharedStyles.container}>
            <Box className={sharedStyles.formPage}>
                <PageHeader
                    headerTitle='Code Redemption'
                    subTitle='Main Menu'
                />

                <Grid container spacing={4} justifyContent="center" columns={12}>
                    <Grid item xs={12} sm={12} md={12}>
                        <Card elevation={10} className={sharedStyles.card}>
                            <CardContent>
                                <Grid item container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <CardHeader
                                            titleTypographyProps={{ fontWeight: 'bold', fontSize: 18, textAlign: 'left', float: 'left' }}
                                            title="Create a new code lot (COMING SOON)"
                                            style={{ width: '80%', float: 'left' }}
                                        />

                                        <Button
                                            variant="contained"
                                            onClick={() => { router.push(process.env.CODE_REDEMPTION_CREATE_LOT) }}
                                            style={{ float: 'left', marginTop: '10px' }}
                                            disabled
                                        >
                                            Navigate
                                        </Button>
                                    </Grid>

                                    {hasLots && <Grid item xs={12} sm={12} md={12}>
                                        <CardHeader
                                            titleTypographyProps={{ fontWeight: 'bold', fontSize: 18, textAlign: 'left', float: 'left' }}
                                            title="View an existing code lot"
                                            style={{ width: '80%', float: 'left' }}
                                        />

                                        <Button
                                            variant="contained"
                                            onClick={() => { router.push(process.env.CODE_REDEMPTION_VIEW_LOT) }}
                                            style={{ float: 'left', marginTop: '10px' }}
                                        >
                                            Navigate
                                        </Button>
                                    </Grid>}

                                    {hasLots && <Grid item xs={12} sm={12} md={12}>
                                        <CardHeader
                                            titleTypographyProps={{ fontWeight: 'bold', fontSize: 18, textAlign: 'left', float: 'left' }}
                                            title="Modify an existing code lot (COMING SOON)"
                                            style={{ width: '80%', float: 'left' }}
                                        />

                                        <Button
                                            variant="contained"
                                            onClick={() => { router.push(process.env.CODE_REDEMPTION_MODIFY_LOT) }}
                                            style={{ float: 'left', marginTop: '10px' }}
                                            disabled
                                        >
                                            Navigate
                                        </Button>
                                    </Grid>}

                                    {hasLots && <Grid item xs={12} sm={12} md={12}>
                                        <CardHeader
                                            titleTypographyProps={{ fontWeight: 'bold', fontSize: 18, textAlign: 'left', float: 'left' }}
                                            title="Delete an existing code lot"
                                            style={{ width: '80%', float: 'left' }}
                                        />

                                        <Button
                                            variant="contained"
                                            onClick={() => { router.push(process.env.CODE_REDEMPTION_DELETE_LOT) }}
                                            style={{ float: 'left', marginTop: '10px' }}
                                        >
                                            Navigate
                                        </Button>
                                    </Grid>}

                                    {hasLots && <Grid item xs={12} sm={12} md={12}>
                                        <CardHeader
                                            titleTypographyProps={{ fontWeight: 'bold', fontSize: 18, textAlign: 'left', float: 'left' }}
                                            title="Look up existing codes"
                                            style={{ width: '80%', float: 'left' }}
                                        />

                                        <Button
                                            variant="contained"
                                            onClick={() => { router.push(process.env.CODE_REDEMPTION_LOOKUP_CODES) }}
                                            style={{ float: 'left', marginTop: '10px' }}
                                        >
                                            Navigate
                                        </Button>
                                    </Grid>}

                                    {hasLots && <Grid item xs={12} sm={12} md={12}>
                                        <CardHeader
                                            titleTypographyProps={{ fontWeight: 'bold', fontSize: 18, textAlign: 'left', float: 'left' }}
                                            title="Redeem a code"
                                            style={{ width: '80%', float: 'left' }}
                                        />

                                        <Button
                                            variant="contained"
                                            onClick={() => { router.push(process.env.CODE_REDEMPTION_REDEEM_A_CODE) }}
                                            style={{ float: 'left', marginTop: '10px' }}
                                        >
                                            Navigate
                                        </Button>
                                    </Grid>}
                                </Grid>
                            </CardContent>

                            <CardContent>
                                <Grid item container spacing={2} justifyContent="center">
                                    <Image
                                        src="/interests.jpg"
                                        width={500}
                                        height={391}
                                        alt={'relevant this is'}
                                        priority={true} />
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box >
        </div >
    )
}

export async function getServerSideProps() {
    try {
        const { data } = await axios.post<GenericResponse | ResponseError>(
            process.env.UBERDOG_RFC_ENDPOINT,
            {
                method: "cr_check_for_current_lots",
                params: {}
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );

        if (data?.error || !data?.result || !data?.result?.hasLots) {
            return {
                props: {
                    hasLots: false
                }
            };
        }

        return {
            props: {
                hasLots: data?.result?.hasLots
            }
        };
    } catch (error: Error | any) {
        if (axios.isAxiosError(error)) {
            return {
                redirect: {
                    permanent: false,
                    destination: process.env.CODE_REDEMPTION_UNAVAILABLE + '?error=' + error.code,
                },
            };
        }

        return {
            redirect: {
                permanent: false,
                destination: process.env.CODE_REDEMPTION_UNAVAILABLE,
            },
        };
    }
}
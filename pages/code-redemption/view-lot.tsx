import Box from '@mui/material/Box';

import { GenericResponse, ResponseError } from '@/components/helpers/ResponseHelpers';
import PageHeader from '@/components/PageHeader/PageHeader';
import ViewLotBody from '@/components/code-redemption/view-lot/ViewLotBody';

import axios from "axios";

import sharedStyles from '@/styles/shared.module.scss';

export default function ViewLot({ lots }: { lots: string[] }) {
    return (
        <div className={sharedStyles.container}>
            <Box className={sharedStyles.formPage}>
                <PageHeader
                    headerTitle='Code Redemption'
                    subTitle='View Lot'
                />

                <ViewLotBody lots={lots} />
            </Box>
        </div>
    )
}

export async function getServerSideProps() {
    try {
        const { data } = await axios.post<GenericResponse | ResponseError>(
            process.env.UBERDOG_RFC_ENDPOINT,
            {
                method: "cr_get_lot_names",
                params: {}
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );

        if (data?.error || !data?.result || !data?.result?.lots) {
            return {
                redirect: {
                    permanent: false,
                    destination: process.env.CODE_REDEMPTION_UNAVAILABLE,
                }
            };
        }

        return {
            props: {
                lots: data.result.lots
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
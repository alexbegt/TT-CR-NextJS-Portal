import Box from '@mui/material/Box';

import { GenericResponse, ResponseError } from '@/components/helpers/ResponseHelpers';
import PageHeader from '@/components/PageHeader/PageHeader';
import CreateLotBody from '@/components/code-redemption/create-lot/CreateLotBody';
import { AwardChoices } from '@/components/helpers/interfaces/FormInterfaces';

import axios from "axios";

import sharedStyles from '@/styles/shared.module.scss';

export default function DeleteLot({ awardChoices, allowAutoGenerated, maxCodeLength, lotNames }: { awardChoices: AwardChoices[], allowAutoGenerated: boolean, maxCodeLength: number, lotNames: string[] }) {
    return (
        <div className={sharedStyles.container}>
            <Box className={sharedStyles.formPage}>
                <PageHeader
                    headerTitle='Code Redemption'
                    subTitle='Create Lot'
                />

                <CreateLotBody awardChoices={awardChoices} allowAutoGenerated={allowAutoGenerated} maxCodeLength={maxCodeLength} lotNames={lotNames} />
            </Box>
        </div>
    )
}

export async function getServerSideProps() {
    try {
        const { data } = await axios.post<GenericResponse | ResponseError>(
            process.env.UBERDOG_RFC_ENDPOINT,
            {
                method: "cr_get_rewards",
                params: {}
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );

        if (data?.error || !data?.result || !(data?.result?.awardChoices && data?.result?.allowAutoGenerated && data?.result?.maxCodeLength && data?.result?.lotNames)) {
            return {
                redirect: {
                    permanent: false,
                    destination: process.env.CODE_REDEMPTION_UNAVAILABLE,
                }
            };
        }

        return {
            props: {
                awardChoices: data.result.awardChoices,
                allowAutoGenerated: data.result.allowAutoGenerated,
                maxCodeLength: data.result.maxCodeLength,
                lotNames: data.result.lotNames,
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
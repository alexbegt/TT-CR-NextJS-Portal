import type { NextApiRequest, NextApiResponse } from 'next';

import { GenericResponse, GenericResponseError, GenericResultsSuccessResponse, ResponseError } from '@/components/helpers/ResponseHelpers';
import { CreateLotForm } from '@/components/helpers/interfaces/FormInterfaces';

import axios from "axios";
import dayjs from 'dayjs';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GenericResultsSuccessResponse | GenericResponseError>
) {
    if (req.method === 'POST') {
        const fields: CreateLotForm = req.body.formData;

        if (!fields) {
            return res.status(500).json({
                success: false,
                error: 'Internal Server Error'
            });
        }

        let expirationMonth = undefined;
        let expirationDay = undefined;
        let expirationYear = undefined;

        if (fields.expiration && fields.hasExpiration) {
            let date = dayjs(fields.expiration);

            expirationMonth = date.month() + 1;
            expirationDay = date.date();
            expirationYear = date.year();
        }


        const { data } = await axios.post<GenericResponse | ResponseError>(
            process.env.UBERDOG_RFC_ENDPOINT,
            {
                method: "cr_create_lot",
                params: {
                    manualCode: fields.codeType == 'Auto' ? false : true,
                    numCodes: fields.numberOfCodes,
                    lotName: fields.lotName,
                    rewardType: fields.rewardType,
                    rewardItemId: fields.rewardItemId,
                    manualCodeStr: fields.manualCode,
                    hasExpiration: fields.hasExpiration,
                    expirationMonth: expirationMonth,
                    expirationDay: expirationDay,
                    expirationYear: expirationYear
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
            },
        );

        if (data?.error || !data?.result) {
            return res.status(400).json({
                success: false,
                error: 'Internal Server Error',
                errorCode: data?.error?.code,
                message: data?.error?.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: data?.result?.message,
            extraMessage: data?.result?.extraMessage,
            codeLotDetails: JSON.parse(data?.result?.codeLotDetails)
        });
    } else {
        return res.status(500).json({
            success: false,
            error: 'This API was called incorrectly'
        });
    }
}
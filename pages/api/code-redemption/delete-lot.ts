import type { NextApiRequest, NextApiResponse } from 'next';

import { GenericResponse, GenericResponseError, GenericSuccessResponse, ResponseError } from '@/components/helpers/ResponseHelpers';
import { DeleteLotForm } from '@/components/helpers/interfaces/FormInterfaces';

import axios from "axios";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GenericSuccessResponse | GenericResponseError>
) {
    if (req.method === 'POST') {
        const fields: DeleteLotForm = req.body.formData;

        if (!fields) {
            return res.status(500).json({
                success: false,
                error: 'Internal Server Error'
            });
        }

        const { data } = await axios.post<GenericResponse | ResponseError>(
            process.env.UBERDOG_RFC_ENDPOINT,
            {
                method: "cr_delete_lot",
                params: {
                    lotName: fields.lotName
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
            extraMessage: data?.result?.extraMessage
        });
    } else {
        return res.status(500).json({
            success: false,
            error: 'This API was called incorrectly'
        });
    }
}
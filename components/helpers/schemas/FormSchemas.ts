import { string, boolean, array, object, ObjectSchema, number } from 'yup';

import TTCodeDict from '@/components/code-redemption/code-dictionary/TTCodeDict';
import { ViewLotForm, DeleteLotForm, LookupForm, RedeemACodeForm, LookupResults } from '@/components/helpers/interfaces/FormInterfaces';

export const ttCodeDict: TTCodeDict = new TTCodeDict();

function emptyStringToUndefined(value: any, originalValue: any) {
    if (typeof originalValue === 'string' && originalValue === '') {
        return undefined;
    }
    return value;
}

export const lookupResultsSchema: ObjectSchema<LookupResults> = object({
    code: string(),
    creation: string(),
    manual: string(),
    rewardCategory: string(),
    rewardItem: string(),
    redeemedAvId: string(),
    redemptions: string(),
});

export const viewLotSchema: ObjectSchema<ViewLotForm> = object({
    lotName: string().required('Code Lot is required'),
    filterOption: string(),
    justCode: boolean(),

    successMessage: string(),
    successful: boolean(),

    lookupResults: array().of(lookupResultsSchema).required(),
});

export const deleteLotSchema: ObjectSchema<DeleteLotForm> = object({
    lotName: string().required('Code Lot is required'),
    confirmLotName: string().required('Code Lot is required'),

    successMessage: string(),
    successful: boolean(),
});

export const lookupSchema: ObjectSchema<LookupForm> = object({
    mode: string().oneOf(['Code', 'AvId'], 'Invalid mode. Impossible!').required('Mode is required'),

    code: string().test('checkValid',
        'Code can only contain alphanumeric characters and dashes',
        (value) => value != undefined && ttCodeDict.isLegalCode(value)
    ).when('mode', ([mode], schema) => mode === 'Code' ? schema.required('Code is required') : schema),

    avId: number().transform(emptyStringToUndefined).typeError('AvId can only contain numbers')
        .when('mode', ([mode], schema) => mode === 'AvId' ? schema.required('AvId is required') : schema),

    successMessage: string(),
    successful: boolean(),

    lookupResults: array().of(lookupResultsSchema).required(),
})

export const redeemACodeSchema: ObjectSchema<RedeemACodeForm> = object({
    code: string().required('Code is required').test('checkValid',
        'Code can only contain alphanumeric characters and dashes',
        (value) => ttCodeDict.isLegalCode(value)
    ),
    avId: number().transform(emptyStringToUndefined).typeError('AvId can only contain numbers').required('Avatar ID is required'),

    successMessage: string(),
    successful: boolean(),
});
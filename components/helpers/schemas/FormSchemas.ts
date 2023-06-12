import { string, boolean, array, object, ObjectSchema, number } from 'yup';

import TTCodeDict from '@/components/code-redemption/code-dictionary/TTCodeDict';
import { ViewLotForm, DeleteLotForm, LookupForm, RedeemACodeForm, LookupResults, CreateLotForm } from '@/components/helpers/interfaces/FormInterfaces';

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
    expiration: string(),
    manual: string(),
    rewardCategory: string(),
    rewardItem: string(),
    redeemedAvId: string(),
    redemptions: string(),
});

export const createLotSchema = (maxCodeLength: number): ObjectSchema<CreateLotForm> => object({
    lotName: string().required('Code Lot is required').matches(
        /^[a-z0-9_]*$/,
        'Name can only contain lowercase ASCII letters, numbers, and underscores'
    ),

    codeType: string().required("Code Type is required"),

    numberOfCodes: number().transform(emptyStringToUndefined).typeError('Number of codes can only contain integers').when('codeType', ([codeType], schema) => codeType === 'Auto' ? schema.required('Number of codes is required').min(1, 'Must be 1 or greater').max(10000000, 'Number cannot be larger than 10000000') : schema),
    confirmNumberOfCodes: number().transform(emptyStringToUndefined).typeError('Number of codes can only contain integers').when('codeType', ([codeType], schema) => codeType === 'Auto' ? schema.required('Number of codes is required').min(1, 'Must be 1 or greater').max(10000000, 'Number cannot be larger than 10000000') : schema),

    manualCode: string().when('mode', ([mode], schema) => mode === 'Manual' ? schema.required('Manual code is required') : schema).max(maxCodeLength, `Code must be ${maxCodeLength} characters or less`),
    confirmManualCode: string().when('mode', ([mode], schema) => mode === 'Manual' ? schema.required('Manual code is required') : schema).max(maxCodeLength, `Code must be ${maxCodeLength} characters or less`),

    rewardType: number().transform(emptyStringToUndefined).typeError('Reward Type can only be a integer').required('Reward Type is required'),
    rewardItemId: number().transform(emptyStringToUndefined).typeError('Reward Item can only be a integer').required('Reward Item is required'),

    hasExpiration: string().required('A choice is required'),
    expiration: string(),

    successMessage: string(),
    successful: boolean(),

    lookupResults: array().of(lookupResultsSchema).required(),
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
import { string, boolean, array, object, ObjectSchema, number } from 'yup';

import TTCodeDict from '@/components/code-redemption/code-dictionary/TTCodeDict';
import { ViewLotForm, DeleteLotForm, LookupForm, RedeemACodeForm, CodeLotDetails, CreateLotForm, ModifyLotForm } from '@/components/helpers/interfaces/FormInterfaces';

export const ttCodeDict: TTCodeDict = new TTCodeDict();

function emptyStringToUndefined(value: any, originalValue: any) {
    if (typeof originalValue === 'string' && originalValue === '') {
        return undefined;
    }
    return value;
}

export const codeLotDetailsSchema: ObjectSchema<CodeLotDetails> = object({
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

    codeLotDetails: array().of(codeLotDetailsSchema).required(),

    successful: boolean(),
    successMessage: string(),
    extraSuccessMessage: string(),

});

export const viewLotSchema: ObjectSchema<ViewLotForm> = object({
    lotName: string().required('Code Lot is required'),
    filterOption: string(),
    justCode: boolean(),

    successful: boolean(),
    successMessage: string(),
    extraSuccessMessage: string(),

    codeLotDetails: array().of(codeLotDetailsSchema).required(),
});

export const modifyLotSchema: ObjectSchema<ModifyLotForm> = object({
    lotName: string().required('Code Lot is required'),
    modification: string().required('Modifcation is required'),
    expiration: string().when('mode', ([modification], schema) => modification === 'Change Expiration Date' ? schema.required('Expiration Date is required') : schema),

    successful: boolean(),
    successMessage: string(),
    extraSuccessMessage: string(),

    codeLotDetails: array().of(codeLotDetailsSchema).required(),
});

export const deleteLotSchema: ObjectSchema<DeleteLotForm> = object({
    lotName: string().required('Code Lot is required'),
    confirmLotName: string().required('Code Lot is required'),

    successful: boolean(),
    successMessage: string(),
    extraSuccessMessage: string(),
});

export const lookupSchema: ObjectSchema<LookupForm> = object({
    mode: string().oneOf(['Code', 'AvId'], 'Invalid mode. Impossible!').required('Mode is required'),

    code: string().test('checkValid',
        'Code can only contain alphanumeric characters and dashes',
        (value) => value != undefined && ttCodeDict.isLegalCode(value)
    ).when('mode', ([mode], schema) => mode === 'Code' ? schema.required('Code is required') : schema),

    avId: number().transform(emptyStringToUndefined).typeError('AvId can only contain numbers')
        .when('mode', ([mode], schema) => mode === 'AvId' ? schema.required('AvId is required') : schema),

    successful: boolean(),
    successMessage: string(),
    extraSuccessMessage: string(),

    codeLotDetails: array().of(codeLotDetailsSchema).required(),
})

export const redeemACodeSchema: ObjectSchema<RedeemACodeForm> = object({
    code: string().required('Code is required').test('checkValid',
        'Code can only contain alphanumeric characters and dashes',
        (value) => ttCodeDict.isLegalCode(value)
    ),
    avId: number().transform(emptyStringToUndefined).typeError('AvId can only contain numbers').required('Avatar ID is required'),

    successful: boolean(),
    successMessage: string(),
    extraSuccessMessage: string(),
});
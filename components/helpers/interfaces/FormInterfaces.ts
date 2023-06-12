export interface CodeLotDetails {
    code?: string
    creation?: string
    expiration?: string
    manual?: string
    rewardCategory?: string
    rewardItem?: string
    redeemedAvId?: string
    redemptions?: string
}

export interface LookupModes {
    mode: string
    displayText: string
}

export interface CreateModes {
    mode: string
    displayText: string
    disabled: boolean
}

export interface IncludesCodeLotDetailsResponse {
    codeLotDetails?: CodeLotDetails[]
}

export interface IncludesSuccessfulResponse {
    successful?: boolean
    successMessage?: string
    extraSuccessMessage?: string
}

export interface Reward {
    itemId: number
    description: string
}

export interface AwardChoices {
    manualReward: boolean
    rewardName: string
    rewardType: number
    rewards: Reward[]
}

export interface CreateLotForm extends IncludesCodeLotDetailsResponse, IncludesSuccessfulResponse {
    lotName: string,

    codeType: string,

    // Used if AUTO
    numberOfCodes?: number | string,
    confirmNumberOfCodes?: number | string,

    // Used if Manual
    manualCode?: string,
    confirmManualCode?: string,

    rewardType: number | string,
    rewardItemId: number | string,

    hasExpiration: string,
    expiration?: string,
}

export interface ViewLotForm extends IncludesCodeLotDetailsResponse, IncludesSuccessfulResponse {
    lotName: string,
    filterOption?: string,
    justCode?: boolean,
}

export interface ModifyLotForm extends IncludesCodeLotDetailsResponse, IncludesSuccessfulResponse {
    lotName: string,
    modification: string,
    expiration?: string,
}

export interface DeleteLotForm extends IncludesSuccessfulResponse {
    lotName: string,
    confirmLotName: string,
}

export interface LookupForm extends IncludesCodeLotDetailsResponse, IncludesSuccessfulResponse {
    mode: string,

    code?: string,
    avId?: number | string,
}

export interface RedeemACodeForm extends IncludesSuccessfulResponse {
    code: string,
    avId: number | string,
}
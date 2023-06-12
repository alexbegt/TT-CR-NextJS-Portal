export interface LookupResults {
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

export interface IncludesLookupResultsForm {
    lookupResults?: LookupResults[]
}

export interface SuccessfulForm {
    successMessage?: string
    successful?: boolean
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

export interface CreateLotForm extends IncludesLookupResultsForm, SuccessfulForm {
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

export interface ViewLotForm extends IncludesLookupResultsForm, SuccessfulForm {
    lotName: string,
    filterOption?: string,
    justCode?: boolean,
}

export interface DeleteLotForm extends SuccessfulForm {
    lotName: string,
    confirmLotName: string,
}

export interface LookupForm extends IncludesLookupResultsForm, SuccessfulForm {
    mode: string,

    code?: string,
    avId?: number | string,
}

export interface RedeemACodeForm extends SuccessfulForm {
    code: string,
    avId: number | string,
}
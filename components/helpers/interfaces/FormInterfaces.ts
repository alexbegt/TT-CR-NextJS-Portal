export interface LookupResults {
    code?: string,
    creation?: string,
    manual?: string,
    rewardCategory?: string,
    rewardItem?: string,
    redeemedAvId?: string,
    redemptions?: string,
}

export interface LookupModes {
    mode: string;
    displayText: string;
}

export interface IncludesLookupResultsForm {
    lookupResults?: LookupResults[],
}

export interface SuccessfulForm {
    successMessage?: string,
    successful?: boolean,
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
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
    codeLot: string,
    filterOption?: string,
    justCode?: boolean,

}

export interface DeleteLotForm extends SuccessfulForm {
    codeLot: string,
    confirmCodeLot: string,
}

export interface LookupForm extends IncludesLookupResultsForm, SuccessfulForm {
    modes: LookupModes[],
    mode: string,

    code?: string,
    avId?: number | string,
}

export interface RedeemACodeForm extends SuccessfulForm {
    code: string,
    avId: number | string,
}
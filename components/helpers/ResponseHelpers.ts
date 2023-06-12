import { CodeLotDetails } from "@/components/helpers/interfaces/FormInterfaces"

export declare type Error = {
    message: string
    code: number
}

export declare type CheckForLots = {
    hasLots: boolean
}

export declare type ResponseError = {
    jsonrpc: string
    id: string
    error: Error
    result?: any
}

export declare type GenericResponse = {
    jsonrpc: string
    id: string
    result: any
    error?: Error
}

export declare type GenericResponseError = {
    success: false
    error: string
    errorCode?: number
    message?: string
    extraMessage?: string
}

export declare type GenericSuccessResponse = {
    success: boolean
    errorCode?: number
    message?: string
    extraMessage?: string
}

export declare type GenericResultsSuccessResponse = {
    success: boolean
    errorCode?: number
    message?: string
    extraMessage?: string
    codeLotDetails?: CodeLotDetails[]
}
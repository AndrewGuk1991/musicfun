import type {ZodType} from "zod";
import {errorToast} from "@/common/utils/errorToast.ts";
import type {FetchBaseQueryError, NamedSchemaError} from "@reduxjs/toolkit/query";

export const withZodCatch = <T extends ZodType>(schema: T) => ({
    responseSchema: schema,
    catchSchemaFailure: (error: NamedSchemaError): FetchBaseQueryError => {
        errorToast('Zod error. Details in the console', error.issues)
        return {
            status: "CUSTOM_ERROR",
            error: 'Schema validation failed'}
    },
})
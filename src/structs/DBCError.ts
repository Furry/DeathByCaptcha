import { Response } from "node-fetch";
import { GenericObject } from "../types.js";

const AliasMap: { [key: string]: string } = {
    "service-overload": "Servers are currently overloaded, please try again later.",
}

/**
 * Represents a Death By Captcha error with a related message and code returned from the API.
 */
export class DBCError extends Error {
    public message: string;
    public code: number;

    constructor(message: string, code: number) {
        super(message);
        this.message = message;
        this.code = code;
    }

    /**
     * Checks an API response for an error status code, resolving and throwing an error if found, otherwise returning the object.
     * @param obj The object to check for errors.
     * @returns The object if no errors were found.
     */
    public static async Resolve(res: any): Promise<any> {
        if (res.status === 500) {
            throw new DBCError(
                "Internal Server Error, please try again later.",
                500
            );
        }

        const obj = await res.json() as GenericObject;

        if (obj.status !== 0) {
            throw new DBCError(
                AliasMap[obj.error] || obj.error,
                obj.status
            );
        }

        delete obj.status;
        return obj;
    }
}
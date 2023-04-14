import { AccountInformation, GenericObject, ServerStatus } from "../types.js";
import fetch from "../utils/fetch.js";
import { DBCError } from "./DBCError.js";

export class Account {
    private _token: string;

    constructor(_token: string) {
        this._token = _token;
    }

    protected get headers(): GenericObject {
        return {
            Accept: "application/json",
        };
    }

    get token(): string {
        return this._token;
    }

    get apiUrl(): string {
        return "http://api.dbcapi.me/api";
    }

    /**
     * Fetches the information from the logged in account.
     * @returns Account information
     */
    async balance(): Promise<AccountInformation> {
        return await fetch(`${this.apiUrl}/user?authtoken=${this._token}`, {
            method: "GET",
            headers: this.headers,
        })
        .then((res) => DBCError.Resolve(res));
    }

    /**
     * Fetches the server status for Death By Captcha.
     * @returns Server status
     */
    async status(): Promise<ServerStatus> {
        return await fetch(`${this.apiUrl}/api/status?authtoken=${this._token}`, {
            method: "GET",
            headers: this.headers,
        })
        .then((res) => DBCError.Resolve(res));
    }

    /**
     * Report a solved captcha as incorrect.
     * @param id The ID of the captcha to report.
     */
    async report(id: number): Promise<void> {
        return await fetch(`${this.apiUrl}/captcha/${id}?authtoken=${this._token}`, {
            method: "POST",
            headers: this.headers,
        })
        .then((res) => DBCError.Resolve(res));
    }
}
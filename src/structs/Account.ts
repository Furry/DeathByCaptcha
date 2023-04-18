import { AccountInformation, GenericObject, ServerStatus } from "../types.js";
import fetch from "../utils/fetch.js";
import { DBCError } from "./DBCError.js";

/**
 * Represents a Death By Captcha account, handling all account-based operations.
 */
export class Account {
    private _token: string;

    /**
     * Constructs a new Account instance.
     * @param _token The API token to use for the account.
     */
    constructor(_token: string) {
        this._token = _token;
    }

    /**
     * The headers to use for API requests.
     */
    protected get headers(): GenericObject {
        return {
            Accept: "application/json",
        };
    }

    /**
     * The API token used for the account.
     */
    get token(): string {
        return this._token;
    }

    /**
     * The API URL to use for requests.
     */
    get apiUrl(): string {
        return "http://api.dbcapi.me/api";
    }

    /**
     * Fetches the information from the logged in account.
     * @returns Account information
     * @throws DBCError If an API error is hit.
     * @example
     * ```ts
     * const account = new Account("token");
     * const info = await account.balance();
     * ```
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
     * @throws DBCError If an API error is hit.
     * @example
     * ```ts
     * const account = new Account("token");
     * const status = await account.status();
     * ```
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
     * @throws DBCError If an API error is hit.
     * @example
     * ```ts
     * const account = new Account("token");
     * await account.report(123456);
     * ```
     */
    async report(id: number): Promise<void> {
        return await fetch(`${this.apiUrl}/captcha/${id}?authtoken=${this._token}`, {
            method: "POST",
            headers: this.headers,
        })
        .then((res) => DBCError.Resolve(res));
    }
}
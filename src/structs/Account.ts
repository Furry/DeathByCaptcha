import { AccountInformation, GenericObject } from "../types.js";
import fetch from "../utils/fetch.js";

export class Account {
    private _token: string;

    constructor(_token: string) {
        this._token = _token;
    }

    private get headers(): GenericObject {
        return {
            Accept: "application/json",
        };
    }

    get token(): string {
        return this._token;
    }

    /**
     * Fetches the information from the logged in account.
     * @returns Account information
     */
    async balance(): Promise<AccountInformation> {
        return await fetch(`http://api.dbcapi.me/api/user?authtoken=${this._token}`, {
            method: "GET",
            headers: this.headers,
        }).then((res) => res.json());
    }
}
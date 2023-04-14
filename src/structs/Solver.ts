import { Account } from "./Account.js";

import * as Utils from "../utils/general.js"
import { DBCError } from "./DBCError.js";
import { CaptchaResponse } from "../types.js";

export class Solver {
    private _account: Account;
    private _pollingFrequency: number = 2000;

    constructor(token: string, pollingFrequency?: number) {
        this._account = new Account(token);
        this._pollingFrequency = pollingFrequency && pollingFrequency < 1000  ? 1000 : pollingFrequency || 2000;
    }

    public get account(): Account {
        return this._account;
    }


    // ! Internal Workings ! //
    private async pollResponse(id: string): Promise<CaptchaResponse> {
        await Utils.sleep(1000);

        while (true) {
            const res = await fetch(`${this.account.apiUrl}/captcha/${id}?authtoken=${this.account.token}`, {
                method: "GET",
                // @ts-ignore
                headers: this.account.headers
            })
            .then((res) => DBCError.Resolve(res));

            if (res.text) {
                return {
                    id: res.captcha,
                    response: res.text
                }
            }
        }
    }

    // Start of solver functions // 
    
}
import { Account } from "./Account.js";

import * as Utils from "../utils/general.js"
import { DBCError } from "./DBCError.js";
import { CaptchaResponse, HCaptchaOptions } from "../types.js";
import fetch from "../utils/fetch.js";

/**
 * The main solver class for Death By Captcha.
 */
export class Solver {
    private _account: Account;
    private _pollingFrequency: number = 2000;

    /**
     * Creates a new Solver instance.
     * @param token The API token to use for the account.
     * @param pollingFrequency How often to pull for captcha updates.
     */
    constructor(token: string, pollingFrequency?: number) {
        this._account = new Account(token);
        this._pollingFrequency = pollingFrequency && pollingFrequency < 1000  ? 1000 : pollingFrequency || 2000;
    }

    /**
     * The account object used to solve captchas.
     */
    public get account(): Account {
        return this._account;
    }

    // ! Internal Workings ! //
    /**
     * Polls for a responce on a captcha following the provided polling frequency.
     * @param id The Captcha ID to poll for a response for.
     * @returns CaptchaResponse
     * @throws DBCError If an API error is hit.
     */
    private async pollResponse(id: string): Promise<CaptchaResponse> {
        await Utils.sleep(this._pollingFrequency);

        while (true) {
            const res = await fetch(`${this.account.apiUrl}/captcha/${id}?authtoken=${this.account.token}`, {
                method: "GET",
                // @ts-ignore
                headers: this.account.headers
            })
            .then((res) => DBCError.Resolve(res));

            if (res.text) {
                return res;
            }
        }
    }

    /**
     * Solves a captcha from a provided image.
     * @param image The Buffer of the image to solve.
     * @returns A CaptchaResponse object.
     * @throws DBCError
     */
    public async imageCaptcha(image: Buffer): Promise<CaptchaResponse> {
        // const form = new FormData();
        // form.append("captchafile", "base64:" + image.toString("base64"), "captcha.jpg");
        // form.append("authtoken", this.account.token);


        return await fetch(`${this.account.apiUrl}/captcha`, {
            method: "POST",
            // @ts-ignore
            headers: this.account.headers,
            body: Utils.objToFormData({
                captchafile: "base64:" + image.toString("base64"),
                authtoken: this.account.token
            })
        })
        .then((res) => DBCError.Resolve(res));
    }

    /**
     * Solves an hCaptcha from a provided sitekey and page URL.
     * @param sitekey The sitekey of the hCaptcha.
     * @param pageurl The URL of the page with the hCaptcha.
     * @returns A CaptchaResponse object.
     * @throws DBCError
     */
    public async hCaptcha(sitekey: string, pageurl: string, hCaptchaOptions: HCaptchaOptions = {}): Promise<CaptchaResponse> {
        const payload = {
            authtoken: this.account.token,
            type: 7,
            hcaptcha_params: Utils.flatten({
                ...hCaptchaOptions,
                sitekey,
                pageurl,
            })
        }

        const res = await fetch(`${this.account.apiUrl}/captcha`, {
            method: "POST",
            // @ts-ignore
            headers: this.account.headers,
            body: Utils.objToFormData(payload)
        })
        .then((res) => DBCError.Resolve(res));

        return await this.pollResponse(res.captcha);
    }
}
import { Account } from "./Account.js";

import * as Utils from "../utils/general.js"
import { DBCError } from "./DBCError.js";
import { CaptchaResponse, FuncaptchaOptions, GeetestOptions, GeetestV3Response, GeetestV4Response, GridType, HCaptchaOptions, RecaptchaCoordnateResponse, RecaptchaImageGroupResponse, RecaptchaV2Options, RecaptchaV3Options } from "../types.js";
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

            if (res["text"]) {
                return res as CaptchaResponse;
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
     * @param hCaptchaOptions The options to use for the hCaptcha.
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

        return await this.pollResponse(res.captcha) as CaptchaResponse;
    }

    /**
     * Solves a recaptcha v2 from a provided sitekey and page URL.
     * @param sitekey The sitekey of the recaptcha.
     * @param pageurl The URL of the page with the recaptcha.
     * @param recaptchav2Options The options to use for the recaptcha.
     * @returns A CaptchaResponse object.
     * @throws DBCError
     */
    public async recaptchaV2(sitekey: string, pageurl: string, recaptchav2Options: RecaptchaV2Options = {}): Promise<CaptchaResponse> {
        const payload = {
            authtoken: this.account.token,
            type: 4,
            token_params: Utils.flatten({
                googlekey: sitekey,
                pageurl,
                ...Utils.flatten(recaptchav2Options)
            })
        }

        const res = await fetch(`${this.account.apiUrl}/captcha`, {
            method: "POST",
            // @ts-ignore
            headers: this.account.headers,
            body: Utils.objToFormData(payload)
        })
        .then((res) => DBCError.Resolve(res));

        return await this.pollResponse(res.captcha) as CaptchaResponse;
    }

    /**
     * Solves a recaptcha v3 from a provided sitekey and page URL, with provided options for action & min_score.
     * @param sitekey The sitekey of the recaptcha.
     * @param pageurl The URL of the page with the recaptcha.
     * @param recaptchav3Options The options to use for the recaptcha.
     * @returns A CaptchaResponse object.
     * @throws DBCError
     */
    public async recaptchaV3(sitekey: string, pageurl: string, recaptchav3Options: RecaptchaV3Options): Promise<CaptchaResponse> {
        const payload = {
            authtoken: this.account.token,
            type: 5,
            token_params: Utils.flatten({
                googlekey: sitekey,
                pageurl,
                ...recaptchav3Options
            })
        }

        const res = await fetch(`${this.account.apiUrl}/captcha`, {
            method: "POST",
            // @ts-ignore
            headers: this.account.headers,
            body: Utils.objToFormData(payload)
        })
        .then((res) => DBCError.Resolve(res));

        return await this.pollResponse(res.captcha) as CaptchaResponse;
    }

    /**
     * Solves a coordnate recaptcha from a provided image.
     * @param captchafile The Buffer of the image with coordnates to solve.
     * @returns A RecaptchaCoordnateResponse object.
     */
    public async recaptchaCoordnates(captchafile: Buffer): Promise<RecaptchaCoordnateResponse> {
        const payload = {
            authtoken: this.account.token,
            type: 2,
            captchafile: "base64:" + captchafile.toString("base64")
        }

        const res = await fetch(`${this.account.apiUrl}/captcha`, {
            method: "POST",
            // @ts-ignore
            headers: this.account.headers,
            body: Utils.objToFormData(payload)
        })
        .then((res) => DBCError.Resolve(res));

        return await this.pollResponse(res.captcha) as unknown as RecaptchaCoordnateResponse;
    }

    /**
     * Solves a recaptcha Image Group from a provided image, banner, and banner text.
     * @param captchafile The Buffer of the image captcha.
     * @param banner The Buffer of the banner image.
     * @param banner_text The text for the banner.
     * @returns A RecaptchaImageGroupResponse object.
     */
    public async recaptchaImageGroup(captchafile: Buffer, banner: Buffer, banner_text: string, gridSize?: GridType): Promise<RecaptchaImageGroupResponse> {
        const payload = {
            authtoken: this.account.token,
            captchafile: "base64:" + captchafile.toString("base64"),
            banner: "base64:" + banner.toString("base64"),
            banner_text,
            type: 3
        }

        // if (gridSize) (payload as any)["grid"] = gridSize;

        const res = await fetch(`${this.account.apiUrl}/captcha`, {
            method: "POST",
            // @ts-ignore
            headers: this.account.headers,
            body: Utils.objToFormData(payload)
        })
        .then((res) => DBCError.Resolve(res));

        return await this.pollResponse(res.captcha) as unknown as RecaptchaImageGroupResponse;
    }

    /**
     * Solves a funcaptcha from a provided public key and page URL.
     * @param publickey The public key of the funcaptcha.
     * @param pageurl The URL of the page with the funcaptcha.
     * @param funcaptchaOptions The options to use for the funcaptcha solve.
     * @returns A CaptchaResponse object.
     * @throws DBCError
     */
    public async funcaptcha(publickey: string, pageurl: string, funcaptchaOptions: FuncaptchaOptions = {}): Promise<CaptchaResponse> {
        const payload = {
            authtoken: this.account.token,
            type: 6,
            funcaptcha_params: Utils.flatten({
                ...funcaptchaOptions,
                publickey,
                pageurl
            })
        }

        const res = await fetch(`${this.account.apiUrl}/captcha`, {
            method: "POST",
            // @ts-ignore
            headers: this.account.headers,
            body: Utils.objToFormData(payload)
        })
        .then((res) => DBCError.Resolve(res));

        return await this.pollResponse(res.captcha) as CaptchaResponse;
    }

    /**
     * Solves a geetest-v3 from a provided challenge, gt, and page URL.
     * @param challenge The challenge of the geetest.
     * @param gt The gt value of the geetest.
     * @param pageurl The URL of the page with the geetest.
     * @param geetestOptions The options to use for the geetest solve.
     * @returns A CaptchaResponse object.
     * @throws DBCError
     */
    public async geetestV3(challenge: string, gt: string, pageurl: string, geetestOptions: GeetestOptions = {}): Promise<GeetestV3Response> {
        const payload = {
            authtoken: this.account.token,
            type: 8,
            geetest_params: Utils.flatten({
                ...geetestOptions,
                challenge,
                gt,
                pageurl
            })
        }

        const res = await fetch(`${this.account.apiUrl}/captcha`, {
            method: "POST",
            // @ts-ignore
            headers: this.account.headers,
            body: Utils.objToFormData(payload)
        })
        .then((res) => DBCError.Resolve(res));

        return await this.pollResponse(res.captcha) as unknown as GeetestV3Response;
    }

    /**
     * Solves a geetest-v4 from a provided captcha_id and page URL.
     * @param captcha_id The captcha_id of the geetest.
     * @param pageurl The URL of the page with the geetest.
     * @returns A CaptchaResponse object.
     * @throws DBCError
     */
    public async geetestV4(captcha_id: string, pageurl: string): Promise<GeetestV4Response> {
        const payload = {
            authtoken: this.account.token,
            type: 9,
            geetest_params: {
                captcha_id,
                pageurl
            }
        }

        const res = await fetch(`${this.account.apiUrl}/captcha`, {
            method: "POST",
            // @ts-ignore
            headers: this.account.headers,
            body: Utils.objToFormData(payload)
        })
        .then((res) => DBCError.Resolve(res));

        return await this.pollResponse(res.captcha) as unknown as GeetestV4Response;
    }
}
import * as DBC from "../dist/index.js";

import dotenv from "dotenv";
import chai from "chai";

dotenv.config();
const { expect } = chai;

describe("hCaptcha via https://vastus.github.io/login", () => {
    const solver = new DBC.Solver(process.env.AUTH_TOKEN);

    it("Should return a proper GeetestV4 response object", async () => {
        const response = await solver.geetestV4("e392e1d7fd421dc63325744d5a2b9c73", "https://2captcha.com/demo/geetest-v4")
        expect(response.text).to.haveOwnProperty("captcha_output");
    })

    it("Should return a proper GeetestV3 response object", async () => {
        const response = await solver.geetestV3(
            "12345678abc90123d45678ef90123a456b",
            "81388ea1fc187e0c335c0a8907ff2625",
            "https://2captcha.com/demo/geetest")
        expect(response.text).to.haveOwnProperty("challenge")
    })
})

import * as DBC from "../dist/index.js";

import dotenv from "dotenv";
import chai from "chai";

dotenv.config();
const { expect } = chai;

describe("RecaptchaV2 via https://patrickhlauke.github.io/recaptcha/", () => {
    const solver = new DBC.Solver(process.env.AUTH_TOKEN);
    it("Should return a proper solved captcha", async () => {
        const response = await solver.recaptchaV2("6Ld2sf4SAAAAAKSgzs0Q13IZhY02Pyo31S2jgOB5", "https://patrickhlauke.github.io/recaptcha/");
        expect(response.text.length).to.be.greaterThan(64);
    });
})

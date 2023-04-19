import * as DBC from "../dist/index.js";

import dotenv from "dotenv";
import chai from "chai";

dotenv.config();
const { expect } = chai;

describe("Recaptcha Solves", () => {
    const solver = new DBC.Solver(process.env.AUTH_TOKEN);
    it("Should return a recaptchav2 solution via https://patrickhlauke.github.io/recaptcha/", async () => {
        const response = await solver.recaptchaV2("6Ld2sf4SAAAAAKSgzs0Q13IZhY02Pyo31S2jgOB5", "https://patrickhlauke.github.io/recaptcha/");
        expect(response.text.length).to.be.greaterThan(64);
    });

    it("Should return a recaptchav3 solution via https://2captcha.com/demo/recaptcha-v3", async () => {
        const response = await solver.recaptchaV3("6LfB5_IbAAAAAMCtsjEHEHKqcB9iQocwwxTiihJu", "https://2captcha.com/demo/recaptcha-v3", {
            action: "demo_action",
            min_score: 0.3
        });
        expect(response.text.length).to.be.greaterThan(64);
    });
})


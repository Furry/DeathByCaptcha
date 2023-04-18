import * as DBC from "../dist/index.js";

import dotenv from "dotenv";
import chai from "chai";

dotenv.config();
const { expect } = chai;

describe("Image Captcha", () => {
    const solver = new DBC.Solver(process.env.AUTH_TOKEN);
    it("Should return a proper solved captcha", async () => {
        const response = await solver.imageCaptcha("./tests/images/simpleTextCaptcha.jpg");
        expect(response.captcha).to.be.a("number")
            .and(response.text).to.be.a("string");
    });
})

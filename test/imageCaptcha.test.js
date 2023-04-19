import * as DBC from "../dist/index.js";

import dotenv from "dotenv";
import chai from "chai";
import fs from "fs";

dotenv.config();
const { expect } = chai;

describe("Image Captcha Solves", () => {
    const solver = new DBC.Solver(process.env.AUTH_TOKEN);
    it("Should return a proper solved captcha", async () => {
        const data = fs.readFileSync("./test/images/simpleTextCaptcha.jpg");
        const response = await solver.imageCaptcha(data);
        expect(response.text.length).to.be.greaterThan(4)
    });
})

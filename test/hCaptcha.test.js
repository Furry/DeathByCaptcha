import * as DBC from "../dist/index.js";

import dotenv from "dotenv";
import chai from "chai";

dotenv.config();
const { expect } = chai;

describe("hCaptcha Solves", () => {
    const solver = new DBC.Solver(process.env.AUTH_TOKEN);
    it("Should return a proper solved captcha via https://vastus.github.io/login", async () => {
        const response = await solver.hCaptcha("e1715201-770b-4f61-87da-523133844aec", "https://vastus.github.io/login");
        expect(response.text.length).to.be.greaterThan(64);
    });
})

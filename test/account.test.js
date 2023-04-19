import * as DBC from "../dist/index.js";

import dotenv from "dotenv";
import chai from "chai";

dotenv.config();
const { expect } = chai;

describe("Account Functions", () => {
    const solver = new DBC.Solver(process.env.AUTH_TOKEN);

    it("Should return a proper balance", async () => {
        const response = await solver.account.balance();
        expect(response.balance).to.be.a("number");
    });

    it("Should return a valid server status", async () => {
        const response = await solver.account.status();
        expect(response).to.haveOwnProperty("is_service_overloaded");
    });
})

// export { Solver } from "./structs/deathbycaptcha"

// ! Testing Code
import { Account } from "./structs/Account.js";
import { config } from "dotenv";
import { Solver } from "./structs/Solver.js";

config();
const solver = new Solver(process.env.AUTH_TOKEN as string);
const account = new Account(process.env.AUTH_TOKEN as string);

solver.account.balance().then((res) => console.log(res));
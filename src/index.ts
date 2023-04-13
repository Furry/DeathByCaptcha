// export { Solver } from "./structs/deathbycaptcha"

// ! Testing Code
import { Account } from "./structs/Account.js";
import { config } from "dotenv";

config();
const account = new Account(process.env.AUTH_TOKEN as string);

account.balance().then((res) => console.log(res));
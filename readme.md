<center>
    <h1>
        DeathByCaptcha
    </h1>

<a href="https://discord.gg/tamVs2Ujrf">
    <img src="https://discordapp.com/api/guilds/769020183540400128/widget.png?style=banner2" alt="Discord Banner 2"/>
</a>

![Discord Shield](https://img.shields.io/github/commit-activity/m/furry/DeathByCaptcha)
![Size](https://img.shields.io/bundlephobia/min/DeathByCaptcha-Api)
![Downloads](https://img.shields.io/npm/dw/DeathByCaptcha-Api)

</center>

<center>A wrapper around the DeathByCaptcha API</center>
<center><a href="https://www.deathbycaptcha.com/">DeathByCaptcha's Website</a></center>

## Features
- Promise based solving.
- NodeJS & Browser support 
- Uses node-fetch for pre njs-16 support
- Fluent Typings & TS Support
- Account integration
- Proxy Support
- Invalid Solve Reporting
- ES6+ Modules

Currently supports:
- Image Captchas / base64
- hCaptcha

## Install

```sh
npm install deathbycaptcha-api
```
```sh
yarn add deathbycaptcha-api
```

## Usage

Basic Usage
```ts
import * as DeathByCapthca from 'deathbycaptcha-api';

const solver = new DeathByCapthca.Solver("Your Token");

const response = await solver.hCaptcha("e1715201-770b-4f61-87da-523133844aec", "https://vastus.github.io/login").then((res) => {
    console.log(res);
});
```

Image Captcha via NodeJS
```ts
import * as DeathByCapthca from 'deathbycaptcha-api';
import fs from "fs";
const solver = new DeathByCapthca.Solver("Your Token");

const response = await solver.image(fs.readFileSync("./captcha.png")).then((res) => {
    console.log(res);
});
```

Proxied Solve:
```ts
import * as DeathByCapthca from 'deathbycaptcha-api';

const solver = new DeathByCapthca.Solver("Your Token");

const response = await solver.hCaptcha("e1715201-770b-4f61-87da-523133844aec", "https://vastus.github.io/login", {
    proxy: "http://username:password@1.2.3.4:8080",
    proxytype: "HTTP" // Only HTTP is supported at the moment.
}).then((res) => {
    console.log(res);
});
```

## Commit Guidelines

The latest version of the code base will always be under the '**next**' branch!

- All pull requiests must provide a valid reason for the change or implementation
- All **CORE CHANGES** require an issue with reasoning made before a PR will even be addressed.
- All PR's must follow the general structure of the code base
- If you have questions, feel free to make an issue and i'll get to it right away!

<hr>
<div style="text-align: center">
<a href="https://www.buymeacoffee.com/ether" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
</div>
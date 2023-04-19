export type GenericObject = 
    { [key: string]: any };

// ! Account Types
export type AccountInformation = {
    user: number; // UID
    rate: number; // Rate
    balance: number; // Current balance
    is_banned: boolean; // Ban status
};

export type ServerStatus = {
    todays_accuracy: number; // Accuracy
    solved_in: number; // Average solve time
    is_service_overloaded: boolean; // Overload status
};

export type CaptchaResponse = {
    captcha: number; // Captcha ID
    text: string; // Captcha text
    is_correct: boolean; // Correctness
}

export interface ProxyOptions {
    host: string;

    // No otheres supported yet :(
    proxyType: "http";
}

// ! Service Types
export interface HCaptchaOptions extends GenericObject {
    proxy?: ProxyOptions;
}

export interface RecaptchaV2Options extends GenericObject {
    proxy?: ProxyOptions;
}

export interface RecaptchaV3Options extends GenericObject {
    proxy?: ProxyOptions;
    action: string,
    min_score: number
}

export interface FuncaptchaOptions extends GenericObject {
    proxy?: ProxyOptions;
}

export interface GeetestOptions extends GenericObject {
    proxy?: ProxyOptions;
}
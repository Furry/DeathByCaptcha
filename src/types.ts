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
    id: number,
    response: string
}
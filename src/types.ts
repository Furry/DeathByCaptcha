export type GenericObject = 
    { [key: string]: any };

// ! Account Types

export type AccountInformation = {
    user: number; // UID
    rate: number; // Rate
    balance: number; // Current balance
    is_banned: boolean; // Ban status
    status: number; // Response status ?
}
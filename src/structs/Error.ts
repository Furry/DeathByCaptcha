const StatusMap: { [key: number] : string } = {
    255: "Not Logged In / Invalid Credentials or Token"
}

export class Error {
    private _message: string;
    private _code: number;

    constructor(message: string, code: number) {
        this._message = message;
        this._code = code;
    }

    public static Resolve<T extends { status: number }>(obj: T): T {
        if (obj.status !== 0) {
            throw new Error(
                StatusMap[obj.status] || "Unknown Error",
                obj.status
            );
        } else {
            return obj;
        }
    }
}
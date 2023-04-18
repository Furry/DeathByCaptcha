import { FormData } from "node-fetch"

/**
 * Sleeps for a set amount of time.
 * @param ms ms to sleep
 */
export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Flattens a nested JSON object.
 * @param obj The object to flatten.
 */
export function flatten(obj: any): any {
    const toReturn: any = {};

    for (const i in obj) {
        if (!obj.hasOwnProperty(i)) continue;

        if ((typeof obj[i]) === "object") {
            const flatObject = flatten(obj[i]);
            for (const x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + "." + x] = flatObject[x];
            }
        } else {
            toReturn[i] = obj[i];
        }
    }
    return toReturn;
}

/**
 * Converts an object to a FormData instance.
 * @param obj The object to convert to FormData.
 * @returns A FormData instance containing all the fields.
 */
export function objToFormData(obj: any): FormData {
    const formdata = new FormData();
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === "object") {
            formdata.append(key, JSON.stringify(obj[key]));
        } else {
            formdata.append(key, obj[key]);
        }
    }

    return formdata;
}
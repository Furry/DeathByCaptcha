/**
 * Sleeps for a set amount of time.
 * @param ms ms to sleep
 */
export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
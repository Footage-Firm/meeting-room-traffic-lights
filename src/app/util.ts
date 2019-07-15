export function delay(seconds: number): Promise<void> {
    return new Promise( resolve => setTimeout(resolve, seconds*1000) );
}

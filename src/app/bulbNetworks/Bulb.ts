import Color from "./Color";

export default interface Bulb {
    readonly id: string;
    readonly label: string;
    setColor: (color: Color) => Promise<void>
    powerOn: (on: boolean) => Promise<void>
}

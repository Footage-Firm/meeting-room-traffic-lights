import Color from "./Color";

export default interface Bulb {
    setColor: (color: Color) => Promise<void>
}
import Color from "../bulbs/Color";

export default interface BulbDriver {
    color: (id: string, color: Color) => Promise<void>;
}
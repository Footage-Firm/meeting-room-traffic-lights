import Bulb from "./Bulb";

export default interface BulbNetwork {
    scanForBulbs: () => Promise<Bulb[]>;
}
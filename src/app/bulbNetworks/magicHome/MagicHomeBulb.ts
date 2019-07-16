import MagicHomeClient from "./client/MagicHomeClient";
import Bulb from "../Bulb";
import Color from "../Color";

export default class MagicHomeBulb implements Bulb {

    constructor(private _client: MagicHomeClient, private _id: string, private _ip: string) {
    }

    get id(): string {
        return this._id;
    }

    get label(): string {
        return this._ip;
    }

    async setColor(color: Color): Promise<void> {
        return this._client.setMagicHomeBulbColor(this._ip, color);
    }

    async powerOn(on: boolean): Promise<void> {
        return this._client.setMagicHomeBulbPower(this._ip, on)
    }

    async pulse(color: Color): Promise<void> {
        throw new Error('pulse not implemented for MagicHome')
    }

}

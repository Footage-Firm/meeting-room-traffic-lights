import LifxClient from "./client/LifxClient";
import Bulb from "../Bulb";
import Color from "../Color";

export default class LifxBulb implements Bulb {

    constructor(private _client: LifxClient, private _id, private _label: string) {

    }

    get id(): string {
        return this._id;
    }

    get label(): string {
        return this._label;
    }

    async setColor(color: Color): Promise<void> {
        return this._client.setLifxBulbColor(this.id, color);
    }

}
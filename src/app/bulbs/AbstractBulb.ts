import Bulb from "./Bulb";
import BulbDriver from "../drivers/BulbDriver";
import Color from "./Color";

export default class AbstractBulb implements Bulb {

    constructor(private _driver: BulbDriver, private _id: string, private _label: string) {

    }

    get id(): string {
        return this._id;
    }

    get label(): string {
        return this._label;
    }

    async setColor(color: Color): Promise<void> {
        await this._driver.color(this.id, color);
    }

}

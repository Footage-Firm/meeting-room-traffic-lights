import BulbNetwork from "../BulbNetwork";
import LifxBulb from "./LifxBulb";
import LifxClient from "./client/LifxClient";
import Bulb from "../Bulb";

export default class LifxBulbNetwork implements BulbNetwork {

    private _client: LifxClient;

    constructor(lifxToken: string) {
        this._client = new LifxClient(lifxToken);
    }

    async scanForBulbs(): Promise<Bulb[]> {
        const bulbInfo = await this._client.scanForLifxBulbs();
        const bulbs = bulbInfo.map(b => new LifxBulb(this._client, b.id, b.label));
        return bulbs;
    }

}
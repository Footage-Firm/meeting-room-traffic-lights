import BulbNetwork from "../BulbNetwork";
import LifxBulb from "../lifx/LifxBulb";
import LifxClient from "../lifx/client/LifxClient";
import Bulb from "../Bulb";
import MagicHomeClient from "./client/MagicHomeClient";
import MagicHomeBulb from "./MagicHomeBulb";

export default class MagicHomeBulbNetwork implements BulbNetwork {

    private _client: MagicHomeClient;

    constructor() {
        this._client = new MagicHomeClient();
    }

    async scanForBulbs(): Promise<Bulb[]> {
        const results = await this._client.scanForMagicHomeBulbs();
        const bulbs = results.map(r => new MagicHomeBulb(this._client, r.id, r.ip));
        return bulbs;
    }

}
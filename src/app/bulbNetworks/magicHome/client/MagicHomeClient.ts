import {Discovery, Control} from 'magic-home'
import Color from "../../Color";
import MagicHomeBulbInfo from "./MagicHomeBulbInfo";

export default class MagicHomeClient {

    async scanForMagicHomeBulbs(): Promise<MagicHomeBulbInfo[]> {
        console.debug('Scanning for Magic Home bulbNetworks');
        const discovery = new Discovery();
        const results = await discovery.scan(3000);
        const bulbs = (results || []).map(r => new MagicHomeBulbInfo(r.id, r.address));
        console.debug('Found Magic Home bulbNetworks', bulbs);
        return bulbs;
    }

    async setMagicHomeBulbColor(bulbIp: string, color: Color): Promise<void> {
        console.debug('Changing color for Magic Home bulb', bulbIp, color);
        const light = new Control(bulbIp, {
            apply_masks: true,
            wait_for_reply: false
        });

        await light.setColorWithBrightness(color.r, color.g, color.b, color.brightness);

        console.debug('Color change request sent');
    }

}

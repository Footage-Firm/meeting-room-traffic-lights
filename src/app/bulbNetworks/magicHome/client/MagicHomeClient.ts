import {Discovery, Control} from 'magic-home'
import Color from "../../Color";
import MagicHomeBulbInfo from "./MagicHomeBulbInfo";
import logger from "../../../logger/logger";

export default class MagicHomeClient {

    async scanForMagicHomeBulbs(): Promise<MagicHomeBulbInfo[]> {
        const seconds = 3
        logger.debug('Scanning for Magic Home bulbNetworks...', {seconds});
        const discovery = new Discovery();
        const results = await discovery.scan(seconds * 1000);
        const bulbs = (results || []).map(r => new MagicHomeBulbInfo(r.id, r.address));
        logger.debug('Found Magic Home bulbNetworks', bulbs);
        return bulbs;
    }

    async setMagicHomeBulbColor(bulbIp: string, color: Color): Promise<void> {
        // logger.debug('Changing color for Magic Home bulb', bulbIp, color);
        const light = new Control(bulbIp, {
            apply_masks: true,
            wait_for_reply: false
        });

        await light.setColorWithBrightness(color.r, color.g, color.b, color.brightness);
    }

    async setMagicHomeBulbPower(bulbIp: string, on: boolean): Promise<void> {
        const light = new Control(bulbIp, {
            apply_masks: true,
            wait_for_reply: false
        });

        await light.setPower(on)
    }


}

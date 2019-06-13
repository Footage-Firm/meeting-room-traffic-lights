import BulbDriver from './BulbDriver';
import {Discovery, Control} from 'magic-home'
import Color from "../bulbs/Color";

export default class MagicHomeDriver implements BulbDriver {

    async scan(): Promise<any> {
        const discovery = new Discovery();
        const results = await discovery.scan(1000);
        return results;
    }

    /**
     * @param id the IP of the bulb
     * @param color
     */
    async color(id: string, color: Color): Promise<void> {
        const light = new Control(id, {
            apply_masks: true,
            wait_for_reply: false
        });

        await light.setColorWithBrightness(color.r, color.g, color.b, color.brightness)
    }

}

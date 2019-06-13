import {Discovery, Control} from 'magic-home'
import Color from "../Color";

export default class MagicHomeDriver {

    async scan(): Promise<any> {
        const discovery = new Discovery();
        const results = await discovery.scan(1000);
        return results;
    }

    async color(ip: string, color: Color): Promise<void> {
        const light = new Control(ip, {
            apply_masks: true,
            wait_for_reply: false
        })

        await light.setColorWithBrightness(color.r, color.g, color.b, color.brightness)
    }

}

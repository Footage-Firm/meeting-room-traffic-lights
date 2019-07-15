import Color from '../../Color';
import axios from 'axios';
import LifxClientBulbInfo from "./LifxClientBulbInfo";
import logger from "../../../logger/logger";


export default class LifxClient {

    axiosDefaultConfig: object;

    constructor(token: string) {
        this.axiosDefaultConfig = {
            headers: {
                Authorization: 'Bearer ' + token //the token is a variable which holds the token
            }
        };
    }

    async scanForLifxBulbs(): Promise<LifxClientBulbInfo[]> {
        logger.debug('Scanning for LIFX bulbNetworks');
        const url = 'https://api.lifx.com/v1/lights/all';
        const response = await axios.get(url, this.axiosDefaultConfig);
        const bulbs = (response.data || []).filter(d => d.connected).map(d => new LifxClientBulbInfo(d.id, d.label));
        logger.debug('Found LIFX bulbNetworks', bulbs);
        return bulbs;
    }

    async setLifxBulbColor(bulbId: string, color: Color): Promise<void> {
        // logger.debug('Changing color for LIFX bulb', {bulbId, color});
        const url = `https://api.lifx.com/v1/lights/id:${bulbId}/state`;
        const data = {
            power: 'on',
            color: `rgb:${color.r},${color.g},${color.b} brightness:${color.brightnessFraction}`
        };
        const response = await axios.put(url, data, this.axiosDefaultConfig);
    }

    async setLifxBulbOn(bulbId: string, on: boolean): Promise<void> {
        const url = `https://api.lifx.com/v1/lights/id:${bulbId}/state`;
        const data = {
            power: 'off'
        };
        const response = await axios.put(url, data, this.axiosDefaultConfig);
    }

    async setLifxBulbPulse(bulbId: string, color: Color, min: number = 1): Promise<void> {
        const url = `https://api.lifx.com/v1/lights/id:${bulbId}/effects/breathe`;
        const periodSec = 5;
        const data = {
            color: `rgb:${color.r},${color.g},${color.b} brightness:${color.brightnessFraction}`,
            from_color: `rgb:${color.r},${color.g},${color.b} brightness:0.01`,
            period: periodSec,
            cycles: Math.round(min / (periodSec/60))
        };
        const response = await axios.post(url, data, this.axiosDefaultConfig);
    }

}

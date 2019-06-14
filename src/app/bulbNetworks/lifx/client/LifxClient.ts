import Color from '../../Color';
import axios from 'axios';
import LifxClientBulbInfo from "./LifxClientBulbInfo";


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
        console.debug('Scanning for LIFX bulbNetworks');
        const url = 'https://api.lifx.com/v1/lights/all';
        const response = await axios.get(url, this.axiosDefaultConfig);
        const bulbs = (response.data || []).filter(d => d.connected).map(d => new LifxClientBulbInfo(d.id, d.label));
        console.debug('Found LIFX bulbNetworks', bulbs);
        return bulbs;
    }

    async setLifxBulbColor(bulbId: string, color: Color): Promise<void> {
        console.debug('Changing color for LIFX bulb', {bulbId, color});
        const url = `https://api.lifx.com/v1/lights/id:${bulbId}/state`;
        const data = {
            power: 'on',
            brightness: Math.max(Math.min(color.brightness / 100, 1.0), 0.0),
            color: `rgb:${color.r},${color.g},${color.b}`
        };
        const response = await axios.put(url, data, this.axiosDefaultConfig);
        console.debug('Color change response',response);
    }

}

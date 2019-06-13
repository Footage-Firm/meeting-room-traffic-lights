import BulbDriver from './BulbDriver';
import Color from '../bulbs/Color';
import config from 'config';
import axios from 'axios';


export default class LifxHomeDriver implements BulbDriver {

    axiosDefaultConfig: object;

    constructor() {
        const token = config.get('lifx.token');
        this.axiosDefaultConfig = {
            headers: {
                Authorization: 'Bearer ' + token //the token is a variable which holds the token
            }
        };
    }


    async scan(): Promise<any> {
        console.debug('Scanning for LIFX devices');
        const url = 'https://api.lifx.com/v1/lights/all';
        const response = await axios.get(url, this.axiosDefaultConfig);
        const slimDeviceList = (response.data || []).map(d => ({
            id: d.id,
            label: d.label
        }));
        console.debug('LIFX Devices:',slimDeviceList);
        return slimDeviceList;
    }

    async color(id: string, color: Color): Promise<void> {
        console.debug('Changing color for LIFX bulb',id);
        const url = `https://api.lifx.com/v1/lights/id:${id}/state`;
        const data = {
            power: 'on',
            brightness: Math.max(Math.min(color.brightness / 100, 1.0), 0.0),
            color: `rgb:${color.r},${color.g},${color.b}`
        };
        const response = await axios.put(url, data, this.axiosDefaultConfig);
        console.debug('Response',response);
    }

}

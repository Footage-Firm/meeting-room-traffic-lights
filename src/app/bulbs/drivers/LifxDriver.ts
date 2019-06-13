import Color from "../Color";
import axios from "axios";


export default class LifxHomeDriver {

    axiosDefaultConfig: object;

    constructor() {
        const token = 'c7872a89874abb3f339dcdb29c5ef1037138ad4ec608d757445d9f4b59003899';
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
        console.debug('Changing color for LIFX bulb ',id);
        const url = `https://api.lifx.com/v1/lights/id:${id}/state`;
        const data = {
            power: 'on',
            brightness: 1.0,
            color: `rgb:${color.r},${color.g},${color.b}`
        };
        const response = await axios.put(url, data, this.axiosDefaultConfig);
        console.debug('Response',response);
    }

}

import LifxBulb from "../../../app/bulbNetworks/lifx/LifxBulb";
import Color from "../../../app/bulbNetworks/Color";
import LifxClient from "../../../app/bulbNetworks/lifx/client/LifxClient";
import config from 'config';

describe('LifxBulb Integration Test', () => {

    test('setColor', async () => {
        const id = 'd073d53c9ba4';
        const token = config.get('lifx.token') as string;
        const client = new LifxClient(token);
        const bulb = new LifxBulb(client, id, 'test bulb');
        await bulb.setColor(Color.YELLOW);
    });

});

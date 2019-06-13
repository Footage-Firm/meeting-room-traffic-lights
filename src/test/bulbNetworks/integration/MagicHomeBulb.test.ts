import Color from "../../../app/bulbNetworks/Color";
import MagicHomeBulb from "../../../app/bulbNetworks/magicHome/MagicHomeBulb";
import MagicHomeClient from "../../../app/bulbNetworks/magicHome/client/MagicHomeClient";

describe('MagicHomeBulb Integration Test', () => {

    const client = new MagicHomeClient();

    test('setColor', async () => {
        const id = 'dummyMagicHomeBulb';
        const ip = '10.100.40.75';
        const bulb = new MagicHomeBulb(client, id, ip);
        await bulb.setColor(Color.PURPLE);
    });

});

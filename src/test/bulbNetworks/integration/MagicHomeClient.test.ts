import Color from "../../../app/bulbNetworks/Color";
import MagicHomeClient from "../../../app/bulbNetworks/magicHome/client/MagicHomeClient";

describe('MagicHomeClient Integration Test', () => {

    const client = new MagicHomeClient();

    test('scanForMagicHomeBulbs', async () => {
        const results = await client.scanForMagicHomeBulbs();
        console.debug('Scan results.', results);
        expect(results).toBeInstanceOf(Array)
    });

    test('setMagicHomeBulbColor', async () => {
        const ip = '10.100.40.75';
        await client.setMagicHomeBulbColor(ip, Color.GREEN);
    });

});
import Color from "../../../app/bulbNetworks/Color";
import MagicHomeClient from "../../../app/bulbNetworks/magicHome/client/MagicHomeClient";
import logger from "../../../app/logger/logger";

describe('MagicHomeClient Integration Test', () => {

    const client = new MagicHomeClient();

    test('scanForMagicHomeBulbs', async () => {
        const results = await client.scanForMagicHomeBulbs();
        logger.debug('Scan results.', results);
        expect(results).toBeInstanceOf(Array)
    });

    test('setMagicHomeBulbColor', async () => {
        const ip = '10.100.40.193';
        await client.setMagicHomeBulbColor(ip, Color.ORANGE);
    });

    test('setMagicHomeBulbPower', async () => {
        const ip = '10.100.40.193';
        await client.setMagicHomeBulbPower(ip, false);
    });

});

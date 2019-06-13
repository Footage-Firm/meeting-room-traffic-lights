import MagicHomeDriver from "../../../app/drivers/MagicHomeDriver";
import Color from "../../../app/bulbs/Color";

describe('MagicHomeDriver Integration Test', () => {

    const driver = new MagicHomeDriver();

    test('scan', async () => {
        const devices = await driver.scan();
        console.debug('Scan results.', {devices})
        expect(devices).toBeInstanceOf(Array)
    });

    test('color', async () => {
        await driver.color('10.100.40.52', Color.PURPLE)
    });

});

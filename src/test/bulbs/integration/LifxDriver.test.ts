import LifxDriver from "../../../app/bulbs/drivers/LifxDriver";
import Color from "../../../app/bulbs/Color";

describe('LifxDriver Integration Test', () => {

    const driver = new LifxDriver();

    test('scan', async () => {
        const devices = await driver.scan();
        console.debug('Scan results.', {devices});
        expect(devices).toBeInstanceOf(Array);
        expect(devices.length).toBeGreaterThan(0);
        expect(devices[0].id).toMatch(/[0-9a-f]+/);
        expect(typeof devices[0].label).toBe('string');
    });

    test('color', async () => {
        await driver.color('d073d53c9ba4', Color.GREEN)
    });

});

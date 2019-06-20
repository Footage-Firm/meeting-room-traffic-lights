import LifxClient from '../../../app/bulbNetworks/lifx/client/LifxClient';
import Color from '../../../app/bulbNetworks/Color';
import config from 'config';

describe('LifxClient Integration Test', () => {

    const token = config.get('lifx.token') as string;
    const client = new LifxClient(token);

    test('scanForLifxBulbs', async () => {
        const results = await client.scanForLifxBulbs();
        console.debug('Scan results.', results);
        expect(results).toBeInstanceOf(Array);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].id).toMatch(/[0-9a-f]+/);
        expect(typeof results[0].label).toBe('string');
    });

    test('setLifxBulbColor', async () => {
        await client.setLifxBulbColor('d073d53c9ba4', Color.RED);
    });

    test('setLifxBulbOn', async () => {
        await client.setLifxBulbOn('d073d53c9ba4', true);
    });

});

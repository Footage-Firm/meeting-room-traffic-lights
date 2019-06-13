import * as faker from 'faker';
import TrafficLights from "../../../app/trafficLights/TrafficLights";

describe('TrafficLights Integration Test', () => {
    const trafficLights = new TrafficLights()

    test('syncBulbs', async () => {
        await trafficLights.syncBulbs()
    });

});

import * as faker from 'faker';
import MeetingTrafficLights from "../../../app/trafficLights/MeetingTrafficLights";

describe('MeetingTrafficLights Integration Test', () => {
    const trafficLights = new MeetingTrafficLights()

    test('syncBulbs', async () => {
        await trafficLights.syncBulbs()
    });

});

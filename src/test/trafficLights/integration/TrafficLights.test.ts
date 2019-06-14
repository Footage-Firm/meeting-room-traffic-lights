import MeetingTrafficLights from "../../../app/trafficLights/MeetingTrafficLights";
import CalendarService from "../../../app/calendar/CalendarService";
import container from "../../../app/inversify.config";

describe('MeetingTrafficLights Integration Test', () => {
    const trafficLights = new MeetingTrafficLights();

    test('syncBulbs', async () => {
        trafficLights.setCalendar(container.get(CalendarService));
        await trafficLights.syncBulbs()
    });

});

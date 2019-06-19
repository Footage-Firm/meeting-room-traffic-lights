import config from 'config'
import * as path from "path";
import MeetingTrafficLights from "../../../app/trafficLights/MeetingTrafficLights";
import CalendarService from "../../../app/calendar/CalendarService";
import LifxBulbNetwork from "../../../app/bulbNetworks/lifx/LifxBulbNetwork";
import MagicHomeBulbNetwork from "../../../app/bulbNetworks/magicHome/MagicHomeBulbNetwork";
import GoogleCalendarClient from "../../../app/calendar/GoogleCalendarClient";

describe('MeetingTrafficLights E2E Test', () => {

    test('syncBulbs', async () => {

        jest.setTimeout(10000)

        const lifxToken = config.get('lifx.token') as string;
        const meetingWarningIntervalMinutes = config.get('timing.meetingWarningIntervalMinutes') as number;
        const meetingEndIntervalMinutes = config.get('timing.meetingEndIntervalMinutes') as number;

        const lights = new MeetingTrafficLights();
        lights.addNetwork(new LifxBulbNetwork(lifxToken));
        lights.addNetwork(new MagicHomeBulbNetwork());

        const keyFile = path.resolve(__dirname, '../../../../', config.get('google.serviceAccountKeyFile'));
        const client = new GoogleCalendarClient(keyFile, config.get('google.subject'))
        const service = new CalendarService(client)
        lights.setCalendar(service)

        lights.setMeetingWarningIntervalMinutes(meetingWarningIntervalMinutes);
        lights.setMeetingEndIntervalMinutes(meetingEndIntervalMinutes);

        await lights.syncBulbs();


    });

});

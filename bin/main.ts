import MeetingTrafficLights from "../src/app/trafficLights/MeetingTrafficLights";
import LifxBulbNetwork from "../src/app/bulbNetworks/lifx/LifxBulbNetwork";
import config from 'config';
import MagicHomeBulbNetwork from "../src/app/bulbNetworks/magicHome/MagicHomeBulbNetwork";
import * as path from "path";
import GoogleCalendarClient from "../src/app/calendar/GoogleCalendarClient";
import CalendarService from "../src/app/calendar/CalendarService";
import logger from "../src/app/logger/logger";

main()

async function main() {

    logger.info('Starting meeting traffic lights!')
    const lights = new MeetingTrafficLights();

    const lifxToken = config.get('lifx.token') as string;
    lights.addNetwork(new LifxBulbNetwork(lifxToken));
    // lights.addNetwork(new MagicHomeBulbNetwork());

    const keyFile = path.resolve(__dirname, '../', config.get('google.serviceAccountKeyFile'));
    const client = new GoogleCalendarClient(keyFile, config.get('google.subject'))
    const service = new CalendarService(client)
    lights.setCalendar(service)

    const meetingWarningIntervalMinutes = config.get('timing.meetingWarningIntervalMinutes') as number;
    const meetingEndIntervalMinutes = config.get('timing.meetingEndIntervalMinutes') as number;
    lights.setMeetingWarningIntervalMinutes(meetingWarningIntervalMinutes);
    lights.setMeetingEndIntervalMinutes(meetingEndIntervalMinutes);

    while (true) {
        await lights.syncBulbs()
        await sleep(60 * 1000)
    }
}

async function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}

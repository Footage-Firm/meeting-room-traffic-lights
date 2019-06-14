import MeetingTrafficLights from "../src/app/trafficLights/MeetingTrafficLights";
import LifxBulbNetwork from "../src/app/bulbNetworks/lifx/LifxBulbNetwork";
import config from 'config';
import MagicHomeBulbNetwork from "../src/app/bulbNetworks/magicHome/MagicHomeBulbNetwork";

//config
const lifxToken = config.get('lifx.token') as string;
const meetingWarningIntervalMinutes = config.get('timing.meetingEndIntervalMinutes') as number;
const meetingEndIntervalMinutes = config.get('timing.meetingEndIntervalMinutes') as number;
//TODO: const pathToGoogleCalendarConfig = config.get('google.calendarConfigPath') as string

const lights = new MeetingTrafficLights();
lights.addNetwork(new LifxBulbNetwork(lifxToken));
lights.addNetwork(new MagicHomeBulbNetwork());
//TODO lights.addCalendar(new GoogleCalendar(pathToConfigFile));
lights.setMeetingWarningIntervalMinutes(meetingWarningIntervalMinutes);
lights.setMeetingEndIntervalMinutes(meetingEndIntervalMinutes);
lights.syncBulbs();
import MeetingTrafficLights from "../src/app/trafficLights/MeetingTrafficLights";
import LifxBulbNetwork from "../src/app/bulbNetworks/lifx/LifxBulbNetwork";
import config from 'config';
import MagicHomeBulbNetwork from "../src/app/bulbNetworks/magicHome/MagicHomeBulbNetwork";
import * as path from "path";
import GoogleCalendarClient from "../src/app/calendar/GoogleCalendarClient";
import CalendarService from "../src/app/calendar/CalendarService";

const lights = new MeetingTrafficLights();

const lifxToken = config.get('lifx.token') as string;
lights.addNetwork(new LifxBulbNetwork(lifxToken));
lights.addNetwork(new MagicHomeBulbNetwork());

lights.scan()
// setInterval(() => lights.scan(), 20*000)

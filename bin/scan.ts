import MeetingTrafficLights from "../src/app/trafficLights/MeetingTrafficLights";
import LifxBulbNetwork from "../src/app/bulbNetworks/lifx/LifxBulbNetwork";
import config from 'config';
import MagicHomeBulbNetwork from "../src/app/bulbNetworks/magicHome/MagicHomeBulbNetwork";
import * as path from "path";
import GoogleCalendarClient from "../src/app/calendar/GoogleCalendarClient";
import CalendarService from "../src/app/calendar/CalendarService";

//config
const lifxToken = config.get('lifx.token') as string;

const lights = new MeetingTrafficLights();
lights.addNetwork(new LifxBulbNetwork(lifxToken));
lights.addNetwork(new MagicHomeBulbNetwork());


// setInterval(() => lights.scan(), 10000)

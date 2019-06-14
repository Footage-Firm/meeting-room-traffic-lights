import * as config from 'config'
import TrafficLights from "../src/app/trafficLights/TrafficLights";
import LifxBulbNetwork from "../src/app/bulbNetworks/lifx/LifxBulbNetwork";
import MagicHomeBulbNetwork from "../src/app/bulbNetworks/magicHome/MagicHomeBulbNetwork";
import GoogleCalendarClient from "../src/app/calendar/GoogleCalendarClient";

const trafficLights = new TrafficLights();
trafficLights.addNetwork(new LifxBulbNetwork('asdf'))
trafficLights.addNetwork(new MagicHomeBulbNetwork())

// trafficLights.addCalendar(new GoogleCalendarClient('config/sevice.json'))

trafficLights.syncBulbs();

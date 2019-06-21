import { ScheduledEvent, Context, Handler } from 'aws-lambda';
import logger from "../src/app/logger/logger";
import MeetingTrafficLights from "../src/app/trafficLights/MeetingTrafficLights";
import LifxBulbNetwork from "../src/app/bulbNetworks/lifx/LifxBulbNetwork";
import CalendarService from "../src/app/calendar/CalendarService";
import container from "../src/app/inversify.config";

export const syncBulbs: Handler =  async (event: ScheduledEvent, context: Context) => {
    logger.info('Running traffic lights lambda handler.');

    const lights = new MeetingTrafficLights();

    const lifxNetwork = container.get(LifxBulbNetwork)
    lights.addNetwork(lifxNetwork)

    const calendarService = container.get(CalendarService)
    lights.setCalendar(calendarService)

    return await lights.syncBulbs()
};

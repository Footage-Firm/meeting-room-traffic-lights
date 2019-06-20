import container from "../../../app/inversify.config";
import CalendarService from "../../../app/calendar/CalendarService";
import logger from "../../../app/logger/logger";

describe('CalendarService Integration Test', () => {

    const calendarService = container.get(CalendarService);

    test('getCurrentMeetings', async () => {
        const rooms = await calendarService.rooms()
        const room = rooms[Math.floor(Math.random()*rooms.length)]
        logger.debug('Testing room for meetings.', {room})
        const {currentMeeting, previousMeeting, nextMeeting} = await calendarService.getCurrentMeetings(room)
        expect(currentMeeting).toBeDefined()
        expect(currentMeeting.start).toBeInstanceOf(Date)
        expect(currentMeeting.end).toBeInstanceOf(Date)
    });

});

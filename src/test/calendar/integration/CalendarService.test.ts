import container from "../../../app/inversify.config";
import CalendarService from "../../../app/calendar/CalendarService";

describe('CalendarService Integration Test', () => {

    const calendarService = container.get(CalendarService);

    test('getCurrentMeetings', async () => {
        const rooms = await calendarService.rooms()
        const {currentMeeting, previousMeeting, nextMeeting} = await calendarService.getCurrentMeetings(rooms[0])
        expect(currentMeeting).toBeDefined()
        expect(currentMeeting.start).toBeInstanceOf(Date)
        expect(currentMeeting.end).toBeInstanceOf(Date)
    });

});

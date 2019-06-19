import dayjs from "dayjs";
import * as td from 'testdouble'
import container from "../../../app/inversify.config";
import CalendarService from "../../../app/calendar/CalendarService";
import GoogleCalendarClient from "../../../app/calendar/GoogleCalendarClient";
import Factory from "../../tools/Factory";

describe('CalendarService Unit Test', () => {

    let service: CalendarService;

    // Mock dependencies
    let mockClient: GoogleCalendarClient;

    beforeAll(mockDependencies);
    afterAll(container.restore);
    afterEach(td.reset);

    test('getCurrentMeetings', async () => {

        // Configure mocks
        const rooms = Factory.dummyRooms({})
        const [room] = rooms
        const meetings = Factory.dummyMeetings(room)
        const now = dayjs()
        td.when(mockClient.listRooms()).thenResolve(rooms);
        td.when(mockClient.listMeetings(room.email, now.startOf('day'))).thenResolve(meetings);

        // Call test method
        const {currentMeeting, previousMeeting, nextMeeting} = await service.getCurrentMeetings(room)

        // Verify results
        expect(previousMeeting).toEqual(meetings[0]);
        expect(currentMeeting).toEqual(meetings[1]);
        expect(nextMeeting).toEqual(meetings[2]);

    });

    function mockDependencies() {
        const Mock = td.imitate(GoogleCalendarClient);
        mockClient = new Mock();
        service = new CalendarService(mockClient);
    }

});

import GoogleCalendarClient from "../../../app/calendar/GoogleCalendarClient";

describe('GoogleCalendarClient Integration Test', () => {

    const client = new GoogleCalendarClient();

    test('listEvents', async () => {
        const events = await client.listEvents()
        expect(events).toBeInstanceOf(Array)
    });

});

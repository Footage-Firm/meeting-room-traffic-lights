import config from 'config'
import {Dayjs} from "dayjs";
import GoogleCalendarClient from "../../../app/calendar/GoogleCalendarClient";

describe('GoogleCalendarClient Integration Test', () => {

    const client = new GoogleCalendarClient();

    test('listRooms', async () => {
        const rooms = await client.listRooms()
        expect(rooms).toBeInstanceOf(Array)
        expect(rooms[0]).toBeInstanceOf(Object)
        expect(typeof rooms[0].name).toBe('string')
    });

    test('listMeetings', async () => {
        const roomMap = config.get('google.roomIdMap');
        const meetings = await client.listMeetings(roomMap['roomOne'])
        expect(meetings).toBeInstanceOf(Array)
        expect(meetings[0]).toBeInstanceOf(Object)
        expect(typeof meetings[0].name).toBe('string')
        expect(typeof meetings[0].minutes).toBe('number')
        expect(meetings[0].start).toBeDefined()
        expect(meetings[0].start.toDate()).toBeInstanceOf(Date)
    });

});

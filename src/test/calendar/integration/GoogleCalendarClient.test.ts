import config from 'config'
import GoogleCalendarClient from "../../../app/calendar/GoogleCalendarClient";
import * as path from "path";

describe('GoogleCalendarClient Integration Test', () => {

    const keyFile = path.resolve(__dirname, '../../../../', config.get('google.serviceAccountKeyFile'));
    const client = new GoogleCalendarClient(keyFile, config.get('google.subject'))

    test('listRooms', async () => {
        const rooms = await client.listRooms()
        expect(rooms).toBeInstanceOf(Array)
        expect(rooms[0]).toBeInstanceOf(Object)
        expect(typeof rooms[0].name).toBe('string')
    });

    test('listMeetings', async () => {
        const rooms = await client.listRooms()
        const room = rooms[Math.floor(Math.random()*rooms.length)]

        const meetings = await client.listMeetings(room.email)

        expect(meetings).toBeInstanceOf(Array)
        expect(meetings[0]).toBeInstanceOf(Object)
        expect(typeof meetings[0].name).toBe('string')
        expect(typeof meetings[0].minutes).toBe('number')
        expect(meetings[0].start).toBeDefined()
        expect(meetings[0].start.toDate()).toBeInstanceOf(Date)
    });

});

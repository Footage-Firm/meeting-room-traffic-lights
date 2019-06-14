import dayjs from 'dayjs'
import GoogleCalendarClient from "./GoogleCalendarClient";
import Room from "./Room";
import Meeting from "./Meeting";

export default class CalendarService {
    constructor(private client: GoogleCalendarClient) {}

    public async rooms(): Promise<Room[]> {
        return await this.client.listRooms();
    }

    public async meetingsToday(room: Room): Promise<Meeting[]> {
        const beginningOfToday = dayjs().startOf('day');
        return await this.client.listMeetings(room.email, beginningOfToday);
    }

}

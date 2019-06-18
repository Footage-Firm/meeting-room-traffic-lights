import dayjs, {Dayjs} from 'dayjs'
import GoogleCalendarClient from "./GoogleCalendarClient";
import Room from "./Room";
import Meeting from "./Meeting";

export default class CalendarService {
    constructor(private client: GoogleCalendarClient) {}

    public async rooms(): Promise<Room[]> {
        return await this.client.listRooms();
    }

    public async getCurrentMeetings(room: Room): Promise<{ currentMeeting?: Meeting, previousMeeting?: Meeting, nextMeeting?: Meeting }> {
        const now = dayjs()
        const beginningOfToday = now.startOf('day');
        try {
            const meetings = await this.client.listMeetings(room.email, beginningOfToday);
            return await this.adjacentMeetings(meetings, now)
        } catch (err) {
            console.warn('Could not get meetings for room: ' + room.name)
            return {}
        }
    }

    /**
     * Get the current, previous, and next meetings from a given time. Assumes an ascending sorted list of meetings passed in.
     * @param {Meeting[]} meetings
     * @param {Dayjs} time
     */
    private adjacentMeetings(meetings: Meeting[], time: Dayjs): { currentMeeting?: Meeting, previousMeeting?: Meeting, nextMeeting?: Meeting } {

        let previousMeeting, currentMeeting, nextMeeting;
        for (let i = 0; i < meetings.length; i++) {
            const meeting = meetings[i]

            if (meeting.end.isBefore(time)) {
                previousMeeting = meeting
            }

            if (meeting.start.isBefore(time) && meeting.end.isAfter(time)) {
                currentMeeting = meeting
            }

            if (meeting.start.isAfter(time)) {
                nextMeeting = meeting
                break;
            }
        }

        return {currentMeeting, previousMeeting, nextMeeting}
    }

}

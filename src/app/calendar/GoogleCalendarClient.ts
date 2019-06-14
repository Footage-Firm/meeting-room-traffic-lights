import {admin_directory_v1, calendar_v3, google} from 'googleapis';
import dayjs, {Dayjs} from 'dayjs'
import {JWT} from 'google-auth-library';
import Calendar = calendar_v3.Calendar;
import Admin = admin_directory_v1.Admin;
import Room from "./Room";
import Meeting from "./Meeting";

export default class GoogleCalendarClient {

    private calendar: Calendar;
    private admin: Admin;

    constructor(serviceAccountKeyFile: string, subject: string) {
        const auth = this.auth(serviceAccountKeyFile, subject);
        this.calendar = google.calendar({version: 'v3', auth});
        this.admin = google.admin({version: 'directory_v1', auth})
    }

    public async listRooms(): Promise<Room[]> {
        const {data: {items}} = await this.admin.resources.calendars.list({customer: 'my_customer'})
        const rooms = items.map(i => ({name: i.resourceName, email: i.resourceEmail}))
        return rooms
    }

    public async listMeetings(resourceEmail: string, start: Dayjs = dayjs().subtract(1, 'day'), end: Dayjs = null): Promise<Meeting[]> {

        const {data: {items}} = await this.calendar.events.list({
            calendarId: resourceEmail,
            timeMin: start.toISOString(),
            timeMax: end ? end.toISOString() : undefined,
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        })

        const meetings: Meeting[] = items.map(i => {
            const start = dayjs(i.start.dateTime)
            const end = dayjs(i.end.dateTime)
            return {
                name: i.summary,
                location: {name: i.location, email: 'TODO'},
                attendees: i.attendees.length,
                start,
                end,
                minutes: end.diff(start, 'minute')
            }
        })

        return meetings

    }

    private auth(keyFile: string, subject: string): JWT {
        return new JWT({
            keyFile,
            subject,
            scopes: [
                'https://www.googleapis.com/auth/calendar.readonly',
                'https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly'
            ]
        })
    }
}

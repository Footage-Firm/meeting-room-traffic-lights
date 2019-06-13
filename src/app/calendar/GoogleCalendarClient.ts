import config from 'config'
import {google} from 'googleapis';
import * as path from "path";
import * as fs from "fs";
import dayjs from 'dayjs'
import {JWT} from 'google-auth-library';

export default class GoogleCalendarClient {

    private calendar: any;

    constructor() {
        this.calendar = google.calendar({version: 'v3', auth: this.auth()});
    }

    public async listEvents(): Promise<any[]> {

        const roomMap = config.get('google.roomIdMap');

        const {data: {items}} = await this.calendar.events.list({
            calendarId: roomMap['roomOne'],
            timeMin: dayjs().subtract(1, 'day').toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        })

        return items

    }

    private auth(): JWT {
        return new JWT({
            keyFile: path.resolve(__dirname, '../../..', config.get('google.serviceAccountKeyFile')),
            subject: config.get('google.subject'),
            scopes: ['https://www.googleapis.com/auth/calendar.readonly']
        })
    }
}

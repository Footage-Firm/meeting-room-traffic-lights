import config from 'config'
import {google} from 'googleapis';
import * as path from "path";
import * as fs from "fs";
import dayjs from 'dayjs'

export default class GoogleCalendarClient {

    private cal: any;

    constructor() {
        let key;
        try {
            const keyFile = path.resolve(__dirname, '../../..', config.get('google.serviceAccountKeyFile'))
            key = JSON.parse(fs.readFileSync(keyFile, 'utf8'))
        } catch (err) {
            throw new Error('Could not parse service account key JSON file: ' + err.message)
        }

        this.cal = new CalendarAPI({
            key: key.private_key,
            serviceAcctId: key.client_email,
            timezone: config.get('google.timezone')
        })
    }

    public async do(): Promise<any> {

        // console.log(await this.cal.CalendarList.list({showHidden: true}))
        // return

        const params = {
            timeMin: dayjs().toISOString(),
            timeMax: dayjs().subtract(3, 'day').toISOString(),
            q: 'asdf'
        };
        const events = await this.cal.Events.list('', params);

        console.info(events)

    }
}

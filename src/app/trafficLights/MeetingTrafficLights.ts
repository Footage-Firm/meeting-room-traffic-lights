import CalendarService from "../calendar/CalendarService";
import Room from "../calendar/Room";
import dayjs from 'dayjs';
import Meeting from "../calendar/Meeting";
import {Dayjs} from "dayjs";
import Color from "../bulbNetworks/Color";
import BulbNetwork from "../bulbNetworks/BulbNetwork";
import Bulb from "../bulbNetworks/Bulb";

export default class MeetingTrafficLights {

    private _calendarService: CalendarService;
    private _networks: BulbNetwork[] = [];
    private _rooms: Room[] = [];

    //Timing
    private _meetingEndIntervalMinutes: number = 5;
    private _meetingWarningIntervalMinutes: number = 5;

    public addNetwork(network: any): void {
        this._networks.push(network)
    }

    public setMeetingEndIntervalMinutes(value: number) {
        this._meetingEndIntervalMinutes = value;
    }

    public setMeetingWarningIntervalMinutes(value: number) {
        this._meetingWarningIntervalMinutes = value;
    }

    public setCalendar(calendarService: CalendarService): void {
        this._calendarService = calendarService
    }

    public async syncBulbs(): Promise<void> {
        await this.findRooms(); // pass in config?
        await this.mapBulbsToRooms(); // you have already added networks

        // for each room, find the current ideal state of its bulb
        for (let room of this._rooms) {
            const color = await this.getBulbColor(room);
            console.debug('Setting color for room', {color, room})
        }
    }

    private async getBulbColor(room: Room): Promise<Color> {

        const now = dayjs();
        const meetings = await this._calendarService.meetingsToday(room)

        // If it is after the previous meeting, RED
        // Otherwise, if it is before end of current meeting, YELLOW
        // Otherwise, if it is during a meeting, GREEN
        // Else off (BLACK)
        const {currentMeeting, previousMeeting, nextMeeting} = this.adjacentMeetings(meetings, now);

        if (previousMeeting && now.diff(previousMeeting.end, 'minute') <= this._meetingEndIntervalMinutes) {
            return Color.RED;
        } else if (currentMeeting && now.diff(currentMeeting.end, 'minute') <= this._meetingWarningIntervalMinutes) {
            return Color.YELLOW;
        } else if (currentMeeting) {
            return Color.GREEN;
        } else {
            return Color.BLACK;
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

    private async findRooms(): Promise<void> {
        this._rooms = await this._calendarService.rooms()
    }

    private async mapBulbsToRooms(): Promise<void> {
        let bulbs: Bulb[] = []
        for (let network of this._networks) {
            bulbs = bulbs.concat(await network.scanForBulbs())
        }

        console.debug('Syncing bulbs and rooms', {bulbs, rooms: this._rooms})

    }


}

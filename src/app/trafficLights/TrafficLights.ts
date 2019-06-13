import CalendarService from "../calendar/CalendarService";
import Room from "../calendar/Room";
import Color from "../bulbs/Color";
import dayjs from 'dayjs';
import Meeting from "../calendar/Meeting";
import {Dayjs} from "dayjs";

export default class TrafficLights {

    private networks: any[]
    private rooms: Room[]
    private calendarService: CalendarService

    constructor(calendarService: CalendarService = new CalendarService()) {
        this.calendarService = calendarService
    }

    public addNetwork(network: any): void {
        this.networks.push(network)
    }

    public async syncBulbs(): Promise<void> {
        await this.findRooms()
        await this.mapBulbsToRooms()

        // for each room, find the current ideal state of its bulb
        for (let room of this.rooms) {
            const color = await this.getBulbColor(room)
            console.debug('Setting color for room', {color, room})
        }
    }

    private async getBulbColor(room: Room): Promise<Color> {

        const now = dayjs()
        const meetings = await this.calendarService.meetingsToday(room)

        // If it is 0-2 minute after the previous meeting, RED
        // If it is 5 min before end of current meeting, Orange
        // If it is >4 min after current meeting, GREEN
        // Else off
        const {currentMeeting, previousMeeting, nextMeeting} = this.adjacentMeetings(meetings, now)
        if (previousMeeting && now.diff(previousMeeting.end, 'minute') <= 2) {
            return Color.RED
        } else if (currentMeeting && now.diff(currentMeeting.end, 'minute') <= 5) {
            return Color.PURPLE
        } else if (currentMeeting) {
            return Color.GREEN
        } else {
            return Color.BLACK
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
        this.rooms = await this.calendarService.rooms()
    }

    private async mapBulbsToRooms(): Promise<void> {
        throw new Error('Not implemented')
    }


}

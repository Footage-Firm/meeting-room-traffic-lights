import config from "config";
import dayjs, {Dayjs} from 'dayjs';
import CalendarService from "../calendar/CalendarService";
import Room from "../calendar/Room";
import Meeting from "../calendar/Meeting";
import Color from "../bulbNetworks/Color";
import BulbNetwork from "../bulbNetworks/BulbNetwork";
import Bulb from "../bulbNetworks/Bulb";

export default class MeetingTrafficLights {

    private _calendarService: CalendarService;
    private _networks: BulbNetwork[] = [];
    private _rooms: Room[] = [];
    private _roomBulbMap: Map<Room, Bulb> = new Map<Room, Bulb>();

    //Timing
    private _meetingEndIntervalMinutes: number = 5;
    private _meetingWarningIntervalMinutes: number = 5;

    public addNetwork(network: any): void {
        this._networks.push(network)
    }

    public setCalendar(calendarService: CalendarService): void {
        this._calendarService = calendarService
    }

    public async syncBulbs(): Promise<void> {
        await this.findRooms(); // pass in config?
        await this.mapBulbsToRooms(); // you have already added networks

        // for each room, find the current ideal state of its bulb
        for (let room of this._roomBulbMap.keys()) {
            const color = await this.getBulbColor(room);
            console.debug('Setting color for room', {color, room})
            const bulb = this._roomBulbMap.get(room)
            await bulb.setColor(color)
        }
    }

    public async scan() {
        for (let network of this._networks) {
            await network.scanForBulbs()
        }
    }

    public setMeetingEndIntervalMinutes(value: number) {
        this._meetingEndIntervalMinutes = value;
    }

    public setMeetingWarningIntervalMinutes(value: number) {
        this._meetingWarningIntervalMinutes = value;
    }


    private async getBulbColor(room: Room): Promise<Color> {

        const now = dayjs();
        console.debug('Getting meetings for room', {room})
        const meetings = await this._calendarService.meetingsToday(room)

        // If it is after the previous meeting, RED
        // Otherwise, if it is before end of current meeting, YELLOW
        // Otherwise, if it is during a meeting, GREEN
        // Else off (BLACK)
        const {currentMeeting, previousMeeting, nextMeeting} = this.adjacentMeetings(meetings, now);

        const roomName = room.name
        if (previousMeeting && now.diff(previousMeeting.end, 'minute') <= this._meetingEndIntervalMinutes) {
            console.debug('Meeting over!', {roomName, diff: now.diff(previousMeeting.end, 'minute')})
            return Color.RED;
        } else if (currentMeeting && currentMeeting.end.diff(now, 'minute') <= this._meetingWarningIntervalMinutes) {
            console.debug('Meeting ending soon.', {roomName, diff: currentMeeting.end.diff(now, 'minute')})
            return Color.ORANGE;
        } else if (currentMeeting) {
            console.debug('Meeting in progress.', {roomName, diff: currentMeeting.end.diff(now, 'minute')})
            return Color.GREEN;
        } else {
            console.debug('No meeting.', {roomName})
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

        console.debug('Syncing bulbs and rooms', {bulbs})

        const roomBulbMap = config.get('roomBulbMap') as Map<string, string>

        for (let roomSubString in roomBulbMap) {
            for (let room of this._rooms) {
                if (room.name.toLowerCase().includes(roomSubString.toLowerCase())) {
                    const bulbId = roomBulbMap.get(roomSubString);
                    const bulb = bulbs.find(b => bulbId == b.id)
                    if (!bulb) {
                        throw new Error('Could not find bulb for bulbId: ' + bulbId)
                    }

                    console.debug('Mapping room to bulb', {room, bulb})
                    this._roomBulbMap.set(room, bulb)
                }
            }
        }

    }


}

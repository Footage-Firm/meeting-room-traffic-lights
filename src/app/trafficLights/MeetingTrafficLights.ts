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
        if (!this._roomBulbMap.size) {
            await this.mapBulbsToRooms();
        }

        // for each room, find the current ideal state of its bulb
        const promises = []
        for (let room of this._roomBulbMap.keys()) {
            const bulb = this._roomBulbMap.get(room)
            promises.push(this.syncBulb(room, bulb))
        }

        await Promise.all(promises)
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

    private async syncBulb(room: Room, bulb: Bulb) {
        const color = await this.getBulbColor(room);

        const {r, g, b} = color
        console.debug('Setting color for room.', {r, g, b, room: room.name, bulb: bulb.label})

        await bulb.setColor(color)
    }

    private async getBulbColor(room: Room): Promise<Color> {

        // If it is after the previous meeting, RED
        // Otherwise, if it is before end of current meeting, YELLOW
        // Otherwise, if it is during a meeting, GREEN
        // Else off (BLACK)
        const {currentMeeting, previousMeeting, nextMeeting} = await this._calendarService.getCurrentMeetings(room)
        const now = dayjs();

        if (previousMeeting && now.diff(previousMeeting.end, 'minute') <= this._meetingEndIntervalMinutes
            || currentMeeting && currentMeeting.end.diff(now, 'minute') == 0) {
            // console.debug('Meeting over!', {roomName, diff: now.diff(previousMeeting.end, 'minute')})
            return Color.RED;
        } else if (currentMeeting && currentMeeting.end.diff(now, 'minute') <= this._meetingWarningIntervalMinutes) {
            // console.debug('Meeting ending soon.', {roomName, diff: currentMeeting.end.diff(now, 'minute')})
            return Color.ORANGE;
        } else if (currentMeeting) {
            // console.debug('Meeting in progress.', {roomName, diff: currentMeeting.end.diff(now, 'minute')})
            return Color.GREEN;
        } else {
            // console.debug('No meeting.', {roomName})
            return Color.BLACK;
        }

    }

    private async findRooms(): Promise<Room[]> {
        return await this._calendarService.rooms()
    }

    private async findBulbs(): Promise<Bulb[]> {
        let bulbs: Bulb[] = []
        for (let network of this._networks) {
            bulbs = bulbs.concat(await network.scanForBulbs())
        }
        return bulbs
    }

    private async mapBulbsToRooms(): Promise<void> {

        const bulbs = await this.findBulbs()
        const rooms = await this.findRooms()

        for (let room of rooms) {

            let roomBulb: Bulb

            // First, attempt to find the bulb using its label
            roomBulb = bulbs.find(bulb => {
                return room.name.toLowerCase().includes(bulb.label.toLowerCase())
            })

            // Then, attempt to find the bulb in overrides
            const roomBulbLabelOverrides = config.get('roomBulbLabelOverrides') as Map<string, string>;
            for (let roomSubString in roomBulbLabelOverrides) {
                if (room.name.toLowerCase().includes(roomSubString.toLowerCase())) {
                    const bulbId = roomBulbLabelOverrides.get(roomSubString);
                    roomBulb = bulbs.find(b => bulbId == b.id)
                    break
                }
            }

            if (roomBulb) {
                console.debug('Mapping room to bulb.', {room, bulb: roomBulb})
                this._roomBulbMap.set(room, roomBulb)
            }

        }

    }


}

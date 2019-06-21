import config from "config";
import dayjs, {Dayjs} from 'dayjs';
import CalendarService from "../calendar/CalendarService";
import Room from "../calendar/Room";
import Meeting from "../calendar/Meeting";
import Color from "../bulbNetworks/Color";
import BulbNetwork from "../bulbNetworks/BulbNetwork";
import Bulb from "../bulbNetworks/Bulb";
import logger from "../logger/logger";

export default class MeetingTrafficLights {

    private _calendarService: CalendarService;
    private _networks: BulbNetwork[] = [];
    private _roomBulbMap: Map<Room, Bulb> = new Map<Room, Bulb>();

    //Timing
    private _meetingEndIntervalMinutes: number = config.get('timing.meetingEndIntervalMinutes');
    private _meetingWarningIntervalMinutes: number = config.get('timing.meetingWarningIntervalMinutes');

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

    public async cycleOff(): Promise<void> {
        if (!this._roomBulbMap.size) {
            await this.mapBulbsToRooms();
        }

        const promises = []
        for (let room of this._roomBulbMap.keys()) {
            const bulb = this._roomBulbMap.get(room)
            logger.info('Cycling bulb off.', {room: room.name, bulb: bulb.label})
            promises.push(bulb.powerOn(false))
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

    private async syncBulb(room: Room, bulb: Bulb): Promise<void> {

        const now = dayjs();
        const {currentMeeting, previousMeeting, nextMeeting} = await this._calendarService.getCurrentMeetings(room)

        // If it is after the previous meeting or the current meeting just ended, RED
        // Otherwise, if it is before end of current meeting, YELLOW
        // Otherwise, if it is during a meeting, GREEN
        // Else off (BLACK)
        if (previousMeeting && now.diff(previousMeeting.end, 'minute') <= this._meetingEndIntervalMinutes
            || currentMeeting && currentMeeting.end.diff(now, 'minute') == 0) {
            logger.debug('Meeting over! Setting bulb to Red.', {room: room.name, bulb: bulb.label})
            await bulb.setColor(Color.RED)
        } else if (currentMeeting && currentMeeting.end.diff(now, 'minute') <= this._meetingWarningIntervalMinutes) {
            logger.debug('Meeting ending soon. Setting bulb to Orange.', {room: room.name, bulb: bulb.label})
            await bulb.setColor(Color.ORANGE)
        } else if (currentMeeting) {
            logger.debug('Meeting in progress. Setting color to Green.', {room: room.name, bulb: bulb.label})
            await bulb.setColor(Color.GREEN)
        } else {
            logger.debug('No meeting. Turning bulb off.', {room: room.name, bulb: bulb.label})
            await bulb.powerOn(false)
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
                    roomBulb = bulbs.find(b => bulbId === b.id)
                    break
                }
            }

            if (roomBulb) {
                logger.debug('Mapping room to bulb.', {room: room.name, bulb: roomBulb.label})
                this._roomBulbMap.set(room, roomBulb)
            }

        }

    }


}

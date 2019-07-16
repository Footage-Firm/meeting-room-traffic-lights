import td from 'testdouble'
import Room from "../../app/calendar/Room";
import Meeting from "../../app/calendar/Meeting";
import dayjs, {Dayjs} from "dayjs";
import Bulb from "../../app/bulbNetworks/Bulb";
import Color from "../../app/bulbNetworks/Color";

export default class Factory {

    static dummyBulbs(props?: Partial<Bulb>|Partial<Bulb>[]): Bulb[] {
        props = props || []
        if (!Array.isArray(props)) {
            props = [props]
        }

        return props.map(p => this.dummyBulb(p.label))
    }

    static dummyBulb(label: string = 'Dummy bulb label.'): Bulb {
        type setColor = (color: Color) => Promise<void>
        type powerOn = (on: boolean) => Promise<void>
        type pulse = (color: Color) => Promise<void>
        return {id: `id: ${label}`, label, setColor: td.func<setColor>(), powerOn: td.func<powerOn>(), pulse: td.func<pulse>()}
    }

    static dummyRooms(props?: Partial<Room>|Partial<Room>[]): Room[] {
        props = props || []
        if (!Array.isArray(props)) {
            props = [props]
        }

        return props.map(p => this.dummyRoom(p.name))
    }

    static dummyRoom(name: string = 'Dummy room'): Room {
        return {name, email: 'dummy.room@test.com'}
    }

    static dummyMeetings(location: Room = this.dummyRooms()[0]): Meeting[] {
        const now = dayjs()
        return [
            Factory.dummyMeeting({location, start: now.subtract(45, 'minute'), end: now.subtract(15, 'minute')}),
            Factory.dummyMeeting({location, start: now.subtract(15, 'minute'), end: now.add(15, 'minute')}),
            Factory.dummyMeeting({location, start: now.add(15, 'minute'), end: now.add(45, 'minute')}),
        ]
    }

    static dummyMeeting(props: Partial<Meeting> = {}): Meeting {
        const start = props.start || dayjs().subtract(15, 'minute')
        const end = props.end || dayjs().add(15, 'minute')
        return {
            name: props.name || 'Dummy meeting.',
            start,
            end,
            attendees: props.attendees || 1,
            minutes: end.diff(start, 'minute'),
            location: props.location || this.dummyRoom()
        }
    }
}

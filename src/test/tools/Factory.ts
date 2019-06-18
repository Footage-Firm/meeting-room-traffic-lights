import Room from "../../app/calendar/Room";
import Meeting from "../../app/calendar/Meeting";
import dayjs, {Dayjs} from "dayjs";

export default class Factory {
    static dummyRooms(): Room[] {
        return [{name: 'dummy room', email: 'dummy.room@test.com'}]
    }

    static dummyMeetings(location: Room = Factory.dummyRooms()[0]): Meeting[] {
        const now = dayjs()
        return [
            Factory.dummyMeeting(location, now.subtract(45, 'minute'), now.subtract(15, 'minute')),
            Factory.dummyMeeting(location, now.subtract(15, 'minute'), now.add(15, 'minute')),
            Factory.dummyMeeting(location, now.add(15, 'minute'), now.add(45, 'minute')),
        ]
    }

    static dummyMeeting(location: Room, start: Dayjs, end: Dayjs, attendees: number = 1): Meeting {
        return {
            name: 'Dummy meeting.',
            location,
            start,
            end,
            attendees,
            minutes: end.diff(start, 'minute')
        }
    }
}

import dayjs, {Dayjs} from "dayjs";
import * as td from 'testdouble'
import container from "../../../app/inversify.config";
import CalendarService from "../../../app/calendar/CalendarService";
import Factory from "../../tools/Factory";
import MeetingTrafficLights from "../../../app/trafficLights/MeetingTrafficLights";
import BulbNetwork from "../../../app/bulbNetworks/BulbNetwork";
import Color from "../../../app/bulbNetworks/Color";
import Room from "../../../app/calendar/Room";
import Bulb from "../../../app/bulbNetworks/Bulb";

describe('MeetingTrafficLights Unit Test', () => {

    let app: MeetingTrafficLights;

    // Mock dependencies
    let mockNetwork: BulbNetwork;
    let mockCalendarService: CalendarService;

    beforeEach(mockDependencies);
    afterAll(container.restore);
    afterEach(td.reset);

    describe('syncBulbs', () => {

        let bulb: Bulb, room: Room, now: Dayjs;
        afterEach(td.reset)
        beforeEach(() => {
            now = dayjs()
            bulb = Factory.dummyBulb('My Meeting Room')
            room = Factory.dummyRoom('My Meeting Room')
            td.when(mockNetwork.scanForBulbs()).thenResolve([bulb]);
            td.when(mockCalendarService.rooms()).thenResolve([room]);
        })

        test('meeting in progress', async () => {
            td.when(mockCalendarService.getCurrentMeetings(room)).thenResolve({
                currentMeeting: Factory.dummyMeeting({start: now.subtract(15, 'm')})
            })
            await app.syncBulbs()
            td.verify(bulb.setColor(Color.GREEN_SOFT))
        })

        test('meeting just started', async () => {
            td.when(mockCalendarService.getCurrentMeetings(room)).thenResolve({
                previousMeeting: Factory.dummyMeeting({end: now.subtract(3, 'm')}),
                currentMeeting: Factory.dummyMeeting({start: now.subtract(1, 'm')})
            })
            await app.syncBulbs()
            td.verify(bulb.pulse(Color.GREEN))
        })

        test('previous meeting just ended, no current meeting', async () => {
            td.when(mockCalendarService.getCurrentMeetings(room)).thenResolve({
                previousMeeting: Factory.dummyMeeting({end: now.subtract(1, 'm')})
            })
            await app.syncBulbs()
            td.verify(bulb.setColor(Color.RED))
        })

        test('meeting just ended, next meeting', async () => {
            td.when(mockCalendarService.getCurrentMeetings(room)).thenResolve({
                currentMeeting: Factory.dummyMeeting({end: now}),
                nextMeeting: Factory.dummyMeeting({start: now})
            })
            await app.syncBulbs()
            td.verify(bulb.pulse(Color.RED))
        })

        test('previous meeting just ended, current meeting', async () => {
            td.when(mockCalendarService.getCurrentMeetings(room)).thenResolve({
                previousMeeting: Factory.dummyMeeting({end: now.subtract(1, 'm')}),
                currentMeeting: Factory.dummyMeeting({start: now})
            })
            await app.syncBulbs()
            td.verify(bulb.pulse(Color.RED))
        })

        test('meeting about to end', async () => {
            td.when(mockCalendarService.getCurrentMeetings(room)).thenResolve({
                currentMeeting: Factory.dummyMeeting({end: now.add(2, 'm')})
            })
            await app.syncBulbs()
            td.verify(bulb.setColor(Color.ORANGE))
        })

        test('no meeting', async () => {
            td.when(mockCalendarService.getCurrentMeetings(room)).thenResolve({})
            await app.syncBulbs()
            td.verify(bulb.powerOn(false))
        })

    });

    test('cycleOff', async () => {

        // Configure mocks
        const bulbs = Factory.dummyBulbs([{label: 'one'}, {label: 'two'}])
        const rooms = Factory.dummyRooms([{name: 'One!'}, {name: 'Two'}])

        td.when(mockNetwork.scanForBulbs()).thenResolve(bulbs);
        td.when(mockCalendarService.rooms()).thenResolve(rooms);

        // Call test method
        await app.cycleOff()

        // Verify results
        const [bulbOne, bulbTwo] = bulbs;
        td.verify(bulbOne.powerOn(false))
        td.verify(bulbTwo.powerOn(false))

    });

    function mockDependencies() {
        mockNetwork = td.object<BulbNetwork>();
        mockCalendarService = new (td.imitate(CalendarService))()
        app = new MeetingTrafficLights();
        app.addNetwork(mockNetwork)
        app.setCalendar(mockCalendarService)
    }

});

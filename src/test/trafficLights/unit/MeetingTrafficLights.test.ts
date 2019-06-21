import dayjs from "dayjs";
import * as td from 'testdouble'
import container from "../../../app/inversify.config";
import CalendarService from "../../../app/calendar/CalendarService";
import GoogleCalendarClient from "../../../app/calendar/GoogleCalendarClient";
import Factory from "../../tools/Factory";
import MeetingTrafficLights from "../../../app/trafficLights/MeetingTrafficLights";
import BulbNetwork from "../../../app/bulbNetworks/BulbNetwork";
import Color from "../../../app/bulbNetworks/Color";

describe('MeetingTrafficLights Unit Test', () => {

    let app: MeetingTrafficLights;

    // Mock dependencies
    let mockNetwork: BulbNetwork;
    let mockCalendarService: CalendarService;

    beforeAll(mockDependencies);
    afterAll(container.restore);
    afterEach(td.reset);

    test('syncBulbs', async () => {

        const now = dayjs()

        // Configure mocks
        const bulbs = Factory.dummyBulbs([{label: 'meeting exists'}, {label: 'ending soon'}, {label: 'GTfo'}, {label: 'no meetings'}])
        const [bulbWithMeeting, bulbEndingSoon, bulbEnded, bulbNoMeeting] = bulbs;
        const rooms = Factory.dummyRooms([{name: 'Meeting exists!'}, {name: 'Ending Soon...'}, {name: 'GTFO'}, {name: 'no meetings here'}])
        const [roomWithMeeting, roomEndingSoon, roomEnded, roomNoMeeting] = rooms;

        td.when(mockNetwork.scanForBulbs()).thenResolve(bulbs);
        td.when(mockCalendarService.rooms()).thenResolve(rooms);
        td.when(mockCalendarService.getCurrentMeetings(roomWithMeeting)).thenResolve({
            currentMeeting: Factory.dummyMeeting({location: roomWithMeeting})
        });
        td.when(mockCalendarService.getCurrentMeetings(roomEndingSoon)).thenResolve({
            currentMeeting: Factory.dummyMeeting({location: roomEndingSoon, end: now.add(5, 'minute')})
        });
        td.when(mockCalendarService.getCurrentMeetings(roomEnded)).thenResolve({
            currentMeeting: Factory.dummyMeeting({location: roomEnded, end: now})
        });
        td.when(mockCalendarService.getCurrentMeetings(roomNoMeeting)).thenResolve({});

        // Call test method
        await app.syncBulbs()

        // Verify results
        td.verify(bulbWithMeeting.setColor(Color.GREEN))
        td.verify(bulbEndingSoon.setColor(Color.ORANGE))
        td.verify(bulbEnded.setColor(Color.RED))
        td.verify(bulbNoMeeting.powerOn(false))

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

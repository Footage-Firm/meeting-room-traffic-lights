import 'reflect-metadata';
import * as path from "path";
import {Container, interfaces} from 'inversify';
import config from 'config';

/**
 * @see https://github.com/inversify/InversifyJS
 *
 * This is the service container. Services may be bound to the container using a reference (usually their own class)
 *   and then resolved in the code by calling `container.get(<reference>)`. When writing tests, you may swap the original
 *   class for a mocked version using `container.rebind(<reference>)`. The container can be restored to its original state
 *   using `container.restore()`.
 *
 * Services bound to the container must be decorated with "@injectable()" above the class declaration.
 */
const container = new Container({skipBaseClassChecks: true});

/**
 * Services are bound below.
 *
 * If we get too many services or the configuration gets too complex, we can explore making service providers
 *   or container modules (https://github.com/inversify/InversifyJS/blob/master/wiki/container_modules.md).
 */
import CalendarService from "./calendar/CalendarService";
import GoogleCalendarClient from "./calendar/GoogleCalendarClient";
import LifxBulbNetwork from "./bulbNetworks/lifx/LifxBulbNetwork";
container.bind(CalendarService).toDynamicValue((context: interfaces.Context) => {
    const keyFile = path.resolve(__dirname, '../../', config.get('google.serviceAccountKeyFile'));
    return new CalendarService(new GoogleCalendarClient(keyFile, config.get('google.subject')))
});

container.bind(LifxBulbNetwork).toDynamicValue(() => {
    const lifxToken = config.get('lifx.token') as string;
    return new LifxBulbNetwork(lifxToken);
})

export default container;

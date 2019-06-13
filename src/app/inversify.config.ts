import 'reflect-metadata';
import {Container} from 'inversify';

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
 *
 */
import ExampleService from "./example/ExampleService";
container.bind(ExampleService).toSelf();

import CalendarService from "./calendar/CalendarService";
container.bind(CalendarService).toSelf();

export default container;

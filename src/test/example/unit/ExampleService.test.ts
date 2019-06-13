import * as td from 'testdouble'
import container from "../../../app/inversify.config";
import ExampleService from "../../../app/example/ExampleService";
import ExampleDriver from "../../../app/example/ExampleDriver";

describe('ExampleService Unit Test', () => {

    let service: ExampleService;

    // Mock dependencies
    let mockDriver: ExampleDriver;

    beforeAll(mockDependencies);
    afterAll(container.restore);
    afterEach(td.reset);

    test('hello', async () => {

        // Configure mocks
        td.when(mockDriver.hello('Bob')).thenResolve('Dummy Response');

        // Call test method
        const example = await service.hello('Bob');

        // Verify results
        expect(example).toEqual('Dummy Response');

    });

    function mockDependencies() {
        const Mock = td.imitate(ExampleDriver);
        mockDriver = new Mock();
        service = new ExampleService(mockDriver);
    }

});

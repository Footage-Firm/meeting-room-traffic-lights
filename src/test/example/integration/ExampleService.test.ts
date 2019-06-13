import * as faker from 'faker';
import container from "../../../app/inversify.config";
import ExampleService from "../../../app/example/ExampleService";

describe('ExampleService Integration Test', () => {
    const exampleService = container.get(ExampleService);

    test('hello', async () => {
        const name = faker.name.firstName();
        const example = exampleService.hello(name);
        expect(example).toEqual(`Hello ${name}!`);
    });

});

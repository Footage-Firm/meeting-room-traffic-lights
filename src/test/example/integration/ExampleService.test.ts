import * as faker from 'faker';
import ExampleService from "../../../app/example/ExampleService";

describe('ExampleService Integration Test', () => {
    const exampleService = new ExampleService();

    test('hello', async () => {
        const name = faker.name.firstName();
        const example = exampleService.hello(name);
        expect(example).toEqual(`Hello ${name}!`);
    });

});

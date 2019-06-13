export default class ExampleService {

    private driver: any;

    constructor() {
        this.driver = {
            hello: (name: string) => `Hello ${name}!`
        };
    }

    public hello(name: string): string {
        return this.driver.hello(name);
    }
}
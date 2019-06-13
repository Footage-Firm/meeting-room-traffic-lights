import {injectable} from "inversify";
import ExampleDriver from "./ExampleDriver";

@injectable()
export default class ExampleService {

    constructor(private driver: ExampleDriver = new ExampleDriver()) {
        // Auto-assign private properties using Typescript constructor assignment
        // @see https://www.typescriptlang.org/docs/handbook/classes.html
    }

    public hello(name: string): string {
        return this.driver.hello(name);
    }
}

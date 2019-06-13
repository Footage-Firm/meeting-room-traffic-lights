import AbstractBulb from "./AbstractBulb";
import LifxDriver from "../drivers/LifxDriver";

export default class LifxBulb extends AbstractBulb {

    constructor(id: string, label: string) {
        const driver = new LifxDriver();
        super(driver, id, label);
    }

}
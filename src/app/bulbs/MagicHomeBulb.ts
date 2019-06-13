import AbstractBulb from "./AbstractBulb";
import MagicHomeDriver from "../drivers/MagicHomeDriver";

export default class LifxBulb extends AbstractBulb {

    constructor(id: string, label: string) {
        const driver = new MagicHomeDriver();
        super(driver, id, label);
    }

}
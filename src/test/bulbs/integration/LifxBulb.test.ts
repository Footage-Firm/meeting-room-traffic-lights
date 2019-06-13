import LifxBulb from "../../../app/bulbs/LifxBulb";
import Color from "../../../app/bulbs/Color";

describe('LifxBulb Integration Test', () => {

    test('setColor', async () => {
        const id = 'd073d53c9ba4';
        const bulb = new LifxBulb(id, 'test bulb');
        await bulb.setColor(Color.YELLOW);
    });

});

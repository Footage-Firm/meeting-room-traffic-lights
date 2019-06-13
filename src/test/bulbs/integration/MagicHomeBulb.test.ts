import LifxBulb from "../../../app/bulbs/LifxBulb";
import Color from "../../../app/bulbs/Color";

describe('MagicHomeBulb Integration Test', () => {

    test('setColor', async () => {
        const id = '10.100.40.52';
        const bulb = new LifxBulb(id, 'test bulb');
        await bulb.setColor(Color.PURPLE);
    });

});

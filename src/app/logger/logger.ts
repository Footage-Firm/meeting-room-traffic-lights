import {Signale} from 'signale'


const options = {
    config: {
        displayTimestamp: true,
        displayFilename: true,
        uppercaseLabel: true,
        underlinePrefix: true
    }
};

const logger = new Signale(options)

export default logger

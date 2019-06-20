import {Signale} from 'signale'


const options = {
    logLevel: 'debug',
    types: {
        debug: {
            badge: null,
            label: 'debug',
            color: 'cyan'
        }
    },
    config: {
        displayTimestamp: true,
        displayFilename: true,
        uppercaseLabel: true,
        underlinePrefix: true
    }
};

const logger = new Signale(options)

export default logger

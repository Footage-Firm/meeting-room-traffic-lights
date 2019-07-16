import config from 'config';
import {Signale} from 'signale'

const options = {
    logLevel: config.get('log.level'),
    types: {
        info: {
            badge: null,
            color: 'cyan',
            label: 'INFO',
            logLevel: 'warn'
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

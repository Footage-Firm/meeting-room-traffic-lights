import {Signale} from 'signale'


const options = {
    disabled: false,
    interactive: false,
    logLevel: 'debug',
    types: {
        santa: {
            badge: '🎅',
            color: 'red',
            label: 'santa',
            logLevel: 'info'
        }
    }
};

const logger = new Signale(options)

export default logger

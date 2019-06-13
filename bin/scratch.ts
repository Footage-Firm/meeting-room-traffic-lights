import * as config from 'config'

console.info('Test config value.', {test: config.get('test')})
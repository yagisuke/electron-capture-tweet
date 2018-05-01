//  ./node_modules/.bin/electron test/main/TwitterLoginManager.getAccessToken.test.js

require('babel-register')
const createTwitterLoginManager = require('../../src/main/createTwitterLoginManager').default

createTwitterLoginManager().getAccessToken().then(result => {
    console.log(result)
}).catch(error => {
    console.log(error)
})
// $ ./node_modules/.bin/babel-node test/main/TwitterClient.verifyCredentials.test.js

import createTwitterOAuth from '../../src/main/createTwitterOAuth'
import createTwitterClient from '../../src/main/createTwitterClient'

const client = createTwitterClient(
    createTwitterOAuth(),
    '!!!AccessToken!!!', // NOTE: 「Keys and Access Tokens」 タブに記載されている 「Access Token」を指定する.
    '!!!Access Token Secret!!!' // NOTE: 「Keys and Access Tokens」 タブに記載されている 「Access Token Secret」を指定する.
)

client.verifyCredentials().then(data => {
    console.log(data)
}).catch(error => {
    console.log(error)
})
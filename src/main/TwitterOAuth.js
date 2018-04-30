import { OAuth } from 'oauth'
import Const from '../const'

const { consumerKey, consumerSecret } = Const

function createTwitterOAuth() {
    return new OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        consumerKey,
        consumerSecret,
        '1.0A',
        null,
        'HMAC-SHA1'
    )
}

export default createTwitterOAuth
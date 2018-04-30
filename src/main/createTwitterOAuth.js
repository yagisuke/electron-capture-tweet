import { OAuth } from 'oauth'
import Const from '../const'

const { TWITTER_CONFIG } = Const

function createTwitterOAuth() {
    return new OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        TWITTER_CONFIG.consumerKey,
        TWITTER_CONFIG.consumerSecret,
        '1.0A',
        null,
        'HMAC-SHA1'
    )
}

export default createTwitterOAuth
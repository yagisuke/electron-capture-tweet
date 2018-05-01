import { app, shell, ipcMain, BrowserWindow } from 'electron'
import createTwitterOAuth from './createTwitterOAuth'

class TwitterLoginManager {
    constructor() {
        this.oauth = createTwitterOAuth()
    }

    getAccessToken() {
        return new Promise((resolve, reject) => {
            this.oauth.getOAuthRequestToken((error, requestToken, requestTokenSecret) => {
                if (error) {
                    return reject(error)
                }
                // 権限付与を要求するための画面をブラウザに表示
                shell.openExternal(`https://api.twitter.com/oauth/authorize?oauth_token=${requestToken}`)

                // PINコード入力用の画面を表示
                const pincodeWindow = new BrowserWindow({
                    width: 400,
                    height: 120,
                    maximizable: false,
                    minimizable: false,
                    resizable: false
                })
                ipcMain.once('SEND_PIN', (e, { pincode }) => {
                    // 入力されたPINコードをアクセストークン、アクセストークンシークレットに変換
                    this.oauth.getOAuthAccessToken(requestToken, requestTokenSecret, pincode, (error, accessToken, accessTokenSecret) => {
                        if (error) {
                            return reject(error)
                        }
                        resolve({ accessToken, accessTokenSecret })
                        pincodeWindow.removeAllListeners('close')
                        pincodeWindow.close()
                    })
                })
                ipcMain.once('CANCEL_PIN', () => pincodeWindow.close())
                pincodeWindow.on('close', () => reject('user_cancel'))
                pincodeWindow.loadURL(`file://${__dirname}/../../pincodeWindow.html`)
            })
        })
    }
}

function createTwitterLoginManager() {
    return new TwitterLoginManager()
}

export default createTwitterLoginManager
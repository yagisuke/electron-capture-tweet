import path from 'path'
import fs from 'fs'
import { app, shell, ipcMain, BrowserWindow } from 'electron'
import createTwitterOAuth from './createTwitterOAuth'
import createTwitterClient from './createTwitterClient'

export class TwitterLoginManager {
    constructor() {
        this.oauth = createTwitterOAuth()
        this.credentialPath = path.join(app.getPath('userData'), '.twitter_credentials')
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

    init() {
        const loginAndVerify = () => {
            return this.getAccessToken().then(credentials => {
                this.saveCredentials(credentials)
                return this.verify()
            })
        }

        const credentials = this.loadCredentials()
        if (!credentials) {
            // Tokenが保存されていない場合
            return loginAndVerify()
        } else {
            return this.verify().catch(() => {
                // 保存されたTokenが正しくない場合
                return loginAndVerify()
            })
        }
    }

    loadCredentials() {
        try {
            this.credentials = JSON.parse(fs.readFileSync(this.credentialPath, 'utf-8'))
            return this.credentials
        } catch(e) {
            this.credentials = null
            return null
        }
    }

    saveCredentials(credentials) {
        this.credentials = credentials
        fs.writeFileSync(this.credentialPath, JSON.stringify(this.credentials), 'utf-8')
    }

    createClient() {
        return createTwitterClient(this.oauth, this.credentials.accessToken, this.credentials.accessTokenSecret)
    }

    verify() {
        return this.createClient().verifyCredentials()
    }
}

function createTwitterLoginManager() {
    return new TwitterLoginManager()
}

export default createTwitterLoginManager
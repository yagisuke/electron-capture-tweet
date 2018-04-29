import { app, screen, BrowserWindow } from 'electron'
import trimDesktop from './trimDesktop'

app.on('ready', () => {
    trimDesktop().then(({ sourceDisplay, trimmendBounds }) => {
        console.log(sourceDisplay, trimmendBounds)
    })
})
import { app, screen, BrowserWindow } from 'electron'
// import trimDesktop from './trimDesktop'
import createCaptureWindow from './createCaptureWindow'

let captureWindow

app.on('ready', () => {
    // trimDesktop().then(({ sourceDisplay, trimmendBounds }) => {
    //     console.log(sourceDisplay, trimmendBounds)
    // })
    captureWindow = createCaptureWindow()
})
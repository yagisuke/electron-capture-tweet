import { app, shell } from 'electron'
import createFileManager from './createFileManager'
import trimDesktop from './trimDesktop'
import createCaptureWindow from './createCaptureWindow'

let captureWindow

function captureAndOpenItem() {
    const fileManager = createFileManager()
    return trimDesktop()
        .then(captureWindow.capture.bind(captureWindow))
        .then(image => {
            const createFilename = fileManager.writeImage(app.getPath('temp'), image)
            return createFilename
        })
        .then(shell.openItem.bind(shell))
        .then(() => {
            if (process.platform !== 'darwin') {
                app.quit()
            }
        })
}

app.on('ready', () => {
    captureWindow = createCaptureWindow()
    captureAndOpenItem()
})
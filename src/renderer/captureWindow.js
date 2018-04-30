import { ipcRenderer, desktopCapturer } from 'electron'

function getDesktopVideoStream(sourceDisplay) {
    return new Promise((resolve, reject) => {
        desktopCapturer.getSources({ types: ['screen'] }, (error, sources) => {
            if (error) {
                return reject(error)
            }

            let targetSource
            if (sources.length === 1) {
                targetSource = sources[0]
            } else {
                targetSource = sources.find(source => source.name === sourceDisplay.name)
            }

            if (!targetSource) {
                return reject({ message: 'No availabele source' })
            }

            // ストリームオブジェクトの取得
            navigator.webkitGetUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: targetSource.id,
                        minWidth: 100,
                        minHeight: 100,
                        maxWidth: 4096,
                        maxHeight: 4096
                    }
                }
            },
            resolve, reject)
        })
    })
}

function getCaptureImage({ videoElement, trimmedBounds, sourceDisplay }) {
    const { videoWidth, videoHeight } = videoElement
    const scale = sourceDisplay.scaleFactor || 1

    // video要素内におけるデスクトップ画像の余白サイズ算出
    const blankWidth = Math.max((videoWidth - sourceDisplay.bounds.width * scale) / 2, 0)
    const blankHeight = Math.max((videoHeight - sourceDisplay.bounds.Height * scale) / 2, 0)

    // video要素内における切り取り対象領域の位置(x座標値・y座標値)算出
    const offestX = (trimmedBounds.x - sourceDisplay.bounds.x) * scale + blankWidth
    const offestY = (trimmedBounds.y - sourceDisplay.bounds.y) * scale + blankHeight

    // canvas要素の作成
    const canvasElement = document.createElement('canvas')
    const context = canvasElement.getContext('2d')

    // 切り取り対象領域の幅と高さをcanvas要素にセット
    canvasElement.width = trimmedBounds.width
    canvasElement.height = trimmedBounds.height

    // canvas要素にvideo要素の内容を描画
    context.drawImage(
        videoElement,
        offestX,
        offestY,
        trimmedBounds.width * scale,
        trimmedBounds.height * scale,
        0,
        0,
        trimmedBounds.width,
        trimmedBounds.height
    )

    return canvasElement.toDataURL('image/png')
}

ipcRenderer.on('CAPTURE', (_, { sourceDisplay, trimmedBounds }) => {
    getDesktopVideoStream(sourceDisplay).then(stream => {
        const videoElement = document.createElement('video')
        videoElement.src = URL.createObjectURL(stream)
        videoElement.play()
        videoElement.addEventListener('loadedmetadata', () => {
            const dataURL = getCaptureImage({ videoElement, trimmedBounds, sourceDisplay })
            ipcRenderer.send('REPLY_CAPTURE', { dataURL })
            videoElement.pause()
            URL.revokeObjectURL(dataURL)
        })
    }).catch(error => {
        ipcRenderer.send('REPLY_CAPTURE', { error })
    })
})
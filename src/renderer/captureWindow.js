import { desktopCapturer, screen } from 'electron'

// desktopCapturer.getSources({ types: ['screen']}, (error, sources) => {
//     sources.forEach(targetSource => {
//         console.log(targetSource)
//         const thumbnailImg = document.createElement('img')
//         thumbnailImg.src = targetSource.thumbnail.toDataURL()

//         document.querySelector('body').appendChild(thumbnailImg)
//     })
// })

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

const sourceDisplay = screen.getPrimaryDisplay()
sourceDisplay.name = 'Screen 1'

getDesktopVideoStream(sourceDisplay).then(stream => {
    const videoElement = document.createElement('video')
    videoElement.src = URL.createObjectURL(stream)
    videoElement.play()
    document.querySelector('body').appendChild(videoElement)
})
let statusCache = 0
let frist_login = true

function getTimeDiff(latest) {
    const timeDiff = new Date(latest) - new Date()

    var seconds = ((timeDiff % 60000) / 1000).toFixed(0)
    return seconds
}

function animateCountUp(el, number) {
    const animationDuration = 1000
    const frameDuration = 1000 / 60
    const totalFrames = Math.round(animationDuration / frameDuration)
    const easeOutQuad = (t) => t * (2 - t)
    let frame = 0
    const countTo = number
    const counter = setInterval(() => {
        frame++
        const progress = easeOutQuad(frame / totalFrames)
        const currentCount = Math.round(countTo * progress)

        if (number !== currentCount) {
            el.innerHTML = currentCount
        }
        if (frame === totalFrames) {
            clearInterval(counter)
        }
    }, frameDuration)
}

function updateData() {
    fetch('http://192.168.0.106:5000/temps.json', {
        headers: {
            Accept: 'text/plain',
        },
    })
        .then((response) => response.text())
        .then((text) => {
            vals = JSON.parse(text)
            level = Math.round(vals.sheme.pop())
            const countupEls = document.querySelectorAll('.numVal')
            const tempDoc = document.querySelectorAll('.numberTemp')
            const serverUp = document.querySelectorAll('.logoInfo')
            const onlineVal = getTimeDiff(vals.lastonline)
            
            // this could be better but it works
            if (serverUp[0].classList.contains('serveroffline')) {
                if (statusCache === 0 && onlineVal < 120) {
                    serverUp[0].classList.toggle('serveroffline')
                    serverUp[0].classList.toggle('serverOnline')
                    statusCache = 1
                }
            }

            if (serverUp[0].classList.contains('serverOnline')) {
                if (statusCache === 1 && onlineVal > 120) {
                    serverUp[0].classList.toggle('serverOnline')
                    serverUp[0].classList.toggle('serveroffline')
                    statusCache = 0
                }
            }

            if (level <= 49) {
                console.info('Chilled.')
                if (tempDoc[0].classList.contains('warninglevel')) {
                    tempDoc[0].classList.toggle('warninglevel')
                } else if (tempDoc[0].classList.contains('criticalLevel')) {
                    tempDoc[0].classList.toggle('criticalLevel')
                }
            } else if (level >= 80) {
                console.warn('HOT!')
                if (!tempDoc[0].classList.contains('criticalLevel')) {
                    tempDoc[0].classList.toggle('criticalLevel')
                }
            } else if (level >= 49) {
                console.warn('WARM!')
                if (!tempDoc[0].classList.contains('warninglevel')) {
                    tempDoc[0].classList.toggle('warninglevel')
                }
            }

            if (frist_login === true) {
                animateCountUp(countupEls[0], vals.sheme.pop())
                frist_login = false
            } else {
                countupEls[0].innerHTML = Math.round(vals.sheme.pop())
            }
        })
}

document.onreadystatechange = function () {
    if (document.readyState == 'complete') {
        updateData()
        setInterval(function () {
            updateData()
        }, 10000)
    }
}

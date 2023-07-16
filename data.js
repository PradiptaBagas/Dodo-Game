const canvas = document.getElementById('game-canvas')
const ctx = canvas.getContext("2d")
// untuk membuat buram waktu menu end muncul
const gameContainer = document.getElementById('game-container')

const bgDodoImg = new Image()
bgDodoImg.src = 'assets/bang dodo2.png'

// game content
const DODO_SPEED = -5
const DODO_WIDTH = 40
const DODO_HEIGHT = 30
const PIPA_WIDTH = 50
const PIPA_GAP = 125

// variabel dari dodo
let dodoX = 50
let dodoY = 50
let dodoVelocity = 0
let dodoAcceleration = 0.1

// variabel dari pipa
let pipaX = 400
let pipaY = canvas.height - 200

// variabel dari score dan highscore
let scoreDiv = document.getElementById('score-display')
let score = 0
let highScore = 0

let scored = false

// tombol space untuk game
document.body.onkeyup = function(e) {
    if(e.code == 'Space'){
        dodoVelocity = DODO_SPEED
    }
}

// tombol untuk restrat game
document.getElementById('restart-button').addEventListener('click', function () {
    hideEndMenu()
    resetGame()
    loop()
})

function increaseScore() {
    if(dodoX > pipaX + PIPA_WIDTH && (dodoY < pipaY + PIPA_GAP || dodoY + DODO_HEIGHT > pipaY + PIPA_GAP) && !scored) {
        score++
        scoreDiv.innerHTML = score
        scored = true
    }
    if(dodoX < pipaX + PIPA_WIDTH){
        scored = false
    }
}

function collisionCheck() {
    // variabel box dodo dan pipa
    const dodoBox = {
        x: dodoX,
        y: dodoY,
        width: DODO_WIDTH,
        height: DODO_HEIGHT
    }

    const topPipaBox = {
        x: pipaX,
        y: pipaY - PIPA_GAP + DODO_HEIGHT,
        width: PIPA_WIDTH,
        height: pipaY 
    }
    const buttomPipaBox = {
        x: pipaX,
        y: pipaY + PIPA_GAP + DODO_HEIGHT,
        width: PIPA_WIDTH,
        height: canvas.height - pipaY - PIPA_GAP
    }

    // cek tabrakan pipa atas
    if (dodoBox.x + dodoBox.width > topPipaBox.x && dodoBox.x < topPipaBox.x + topPipaBox.width && 
        dodoBox.y < topPipaBox.y) {
        return true 
    } 
    // cek tabrakan pipa bawah
    if(dodoBox.x + dodoBox.width > buttomPipaBox.x && dodoBox.x < buttomPipaBox.x + buttomPipaBox.width && 
        dodoBox.y + dodoBox.height > buttomPipaBox.y) {
        return true
    }

    // cek jika dodo terkena batasan
    if(dodoY < 0 || dodoY + DODO_HEIGHT > canvas.height) {
        return true
    }
    return false
}

function hideEndMenu() {
    document.getElementById('end-menu').style.display = 'none'
    gameContainer.classList.remove('backdrop-blur')
}

function showEndMenu() {
    document.getElementById('end-menu').style.display = 'block'
    gameContainer.classList.add('backdrop-blur')
    document.getElementById('end-score').innerHTML = score
    if(highScore < score){
        highScore = score
    }
    document.getElementById('best-score').innerHTML = highScore
}

function resetGame() {
        dodoX = 50
        dodoY = 50
        dodoVelocity = 0
        dodoAcceleration = 0.1

        pipaX = 400
        pipaY = canvas.height - 200
        
        score = 0
}

function endGame() {
    showEndMenu()
}

function loop() {
    // reset ctx
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // draw bgdodo
    ctx.drawImage(bgDodoImg, dodoX, dodoY)

    // draw pipa
    ctx.fillStyle = '#33333'
    ctx.fillRect(pipaX, -100, PIPA_WIDTH, pipaY)
    ctx.fillRect(pipaX, pipaY + PIPA_GAP, PIPA_WIDTH, canvas.height - pipaY)

    // tabrak pipa
    if(collisionCheck()) {
        endGame()
        return
    }

    // pindah pipa
    pipaX -= 1.5
    // munculkan pipa yang lain
    if(pipaX < -50){
        pipaX = 400
        pipaY = Math.random() * (canvas.height - PIPA_GAP) + PIPA_WIDTH
    }

    // gravity dodo
    dodoVelocity += dodoAcceleration
    dodoY += dodoVelocity

    increaseScore()
    requestAnimationFrame(loop)
}

loop();
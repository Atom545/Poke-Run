import {setupGround, updateGround} from "./ground.js"
import {setupDino, updateDino, getDinoRects, setDinoLose} from "./dino.js"
import {setupCactus, updateCactus, getCactusRects} from "./cactus.js"

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const gameover = new Audio('gameover.wav')

const worldElem = document.querySelector('[data-world]')
const scoreElem = document.querySelector('[data-score]')
const hiscoreElem = document.querySelector('[data-hiscore]')
const startScreenElem = document.querySelector('[data-start-screen]')
// By using querySelector we can pass id selector ('#id') or class selector ('.class') or tag selector ('tag') or other advance selectors or data attribute ('[data-*]') to get that specific element

setPixelToWorldScale()
window.addEventListener("resize",setPixelToWorldScale)
window.addEventListener("keydown", handleStart, {once : true})
// window.addEventListener(event, function, Capture)
    // Event --> Required. Do not use "on" prefix. Use "click" insted of "onclick"
    // Function --> Required.
    // Capture --> Optional (default = false)


let lastTime
let speedScale
let score

// This function will update everything ground, speed, score with time
function update(time) {
    if (lastTime == null) {
        lastTime = time;
        window.requestAnimationFrame(update);
        // The requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint (A repaint occurs when changes are made to an elements skin that changes visibly, but do not affect its layout).
        return
    }
    const delta = time - lastTime;

    updateGround(delta, speedScale)
    updateDino(delta, speedScale)
    updateCactus(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)
    if (checkLose()) {
        return handleLose()
    }

    lastTime = time;
    window.requestAnimationFrame(update)
}

function checkLose() {
    const dinoRect = getDinoRects()
    return getCactusRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom && 
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
    )
}

// This will increase the speed of the game as time passes
function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE
}



// This will update the score and high score as time passes 
let hiscore = localStorage.getItem("hiscore")
let hiscoreval
if(hiscore === null) {
    hiscoreval = 0
    localStorage.setItem("hiscore" , JSON.stringify(hiscoreval))
}
else {
    hiscoreval = JSON.parse(hiscore)
    hiscoreElem.textContent = 'High Score : ' + Math.floor(hiscore)
}

function updateScore(delta) {
    score += delta * 0.01
    if (score > hiscoreval) {
        hiscoreval = score
        localStorage.setItem("hiscore" , JSON.stringify(hiscoreval))
        hiscoreElem.textContent = 'High Score : ' + Math.floor(hiscoreval)
    }
    scoreElem.textContent = 'Score : ' + Math.floor(score)
}



// This function will make sure when the page is refreshed everything starts from the begining
function handleStart() {
    lastTime = null
    speedScale = 1
    score = 0
    setupGround()
    setupDino()
    setupCactus()
    startScreenElem.classList.add("hide")
    window.requestAnimationFrame(update)
}

function handleLose() {
    gameover.play()
    setDinoLose()
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, {once : true})
        startScreenElem.classList.remove("hide")
    }, 100)
}

// This will scale the game according to our browser screen 
function setPixelToWorldScale() {
    let worldToPixelScale
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH
    } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT
    }

    worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
    worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}
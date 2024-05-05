import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const JUMP_SPEED = 0.45
const GRAVITY = 0.0018
const DINO_FRAME_COUNT = 4
const FRAME_TIME = 100
const dinoElem = document.querySelector('[data-dino]')
const jumpSound = new Audio('jump.wav')

let isJumping
let dinoFrame
let currentFrameTime
let yVelocity
export function setupDino() {
    isJumping = false
    dinoFrame = 0
    currentFrameTime = 0
    yVelocity = 0
    setCustomProperty(dinoElem, "--bottom", 0)
    document.removeEventListener("keydown", onJump)
    document.addEventListener("keydown", onJump)
}

export function updateDino(delta, speedScale) {
    handleRun(delta, speedScale)
    handleJump(delta)
}

export function getDinoRects() {
    return dinoElem.getBoundingClientRect()
}

export function setDinoLose() {
    dinoElem.src = "pikachu-standing.png"
}

function handleRun(delta, speedScale) {
    if (isJumping) {
        dinoElem.src = `pikachu-run-2.png`
        return
    }
    if (currentFrameTime >= FRAME_TIME) {
        dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
        dinoElem.src = `pikachu-run-${dinoFrame}.png`
        currentFrameTime -= FRAME_TIME
    }
    currentFrameTime += delta * speedScale
}

function handleJump(delta) {
    if (!isJumping) {
        return
    }

    incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta)
    
    if (getCustomProperty(dinoElem, "--bottom") <= 0) {
        setCustomProperty(dinoElem, "--bottom", 0)
        isJumping = false
    }

    yVelocity -= GRAVITY * delta
}

function onJump(e) {
    if (e.code !== "Space" || isJumping) {
        return
    }
    jumpSound.play()
    yVelocity = JUMP_SPEED
    isJumping = true
}
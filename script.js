const board = document.getElementById('game-board')
const gridSize = 20
const startButtonText = document.getElementById('startButtonText')
const logo = document.getElementById('logo')
const score = document.getElementById('score')
const highScoretext = document.getElementById('highScore')

let snake = [{ x: 10, y: 10 }]
let food = generateFood()
let direction = 'right'
let gameInterval
let gameSpeedDelay = 200
let gameStarted = false
let highScore = 0
let keyPressAllowed = true

function draw() {
  board.innerHTML = ''
  drawSnake()
  drawFood()
  updateScore()
}

function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake')
    setPosition(snakeElement, segment)
    board.appendChild(snakeElement)
  })
}

function createGameElement(tag, className) {
  const element = document.createElement(tag)
  element.className = className
  return element
}

function setPosition(element, position) {
  element.style.gridColumn = position.x
  element.style.gridRow = position.y
}
function drawFood() {
  const foodElement =
    document.getElementById('food') || createGameElement('div', 'food')
  foodElement.id = 'food'
  setPosition(foodElement, food)
  foodElement.classList.toggle('visible', gameStarted)
  if (!document.body.contains(foodElement)) board.appendChild(foodElement)
}

function generateFood() {
  let x, y, foodOnSnake
  do {
    x = Math.floor(Math.random() * gridSize) + 1
    y = Math.floor(Math.random() * gridSize) + 1
    foodOnSnake = snake.some((segment) => segment.x === x && segment.y === y)
  } while (foodOnSnake)
  return { x, y }
}

function move() {
  const head = { ...snake[0] }
  switch (direction) {
    case 'up':
      head.y--
      break
    case 'down':
      head.y++
      break
    case 'left':
      head.x--
      break
    case 'right':
      head.x++
      break
  }

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame()
    return
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame()
      return
    }
  }

  snake.unshift(head)

  if (head.x === food.x && head.y === food.y) {
    food = generateFood()
    increaseSpeed()
    clearInterval(gameInterval)
    gameInterval = setInterval(() => {
      move()
      draw()
    }, gameSpeedDelay)
  } else {
    snake.pop()
  }
}

function startGame() {
  resetGame() // Ensure all variables and elements are reset
  gameStarted = true
  startButtonText.style.display = 'none'
  logo.style.display = 'none'

  // Make food element visible again
  const foodElement = document.getElementById('food')
  if (foodElement) {
    foodElement.classList.add('visible')
  }

  updateScore()
  gameInterval = setInterval(() => {
    move()
    draw()
  }, gameSpeedDelay)
}

function handleKeyPress(event) {
  if (!gameStarted) {
    if (event.code === 'Space' || event.key === ' ') startGame()
    return
  }

  if (!keyPressAllowed) return

  const oppositeDirections = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
  }

  const newDirection = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
  }[event.key]

  if (newDirection && newDirection !== oppositeDirections[direction]) {
    direction = newDirection
    keyPressAllowed = false
    setTimeout(() => (keyPressAllowed = true), gameSpeedDelay)
  }
}

document.addEventListener('keydown', handleKeyPress)

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1
  }
}

function checkCollision() {
  const head = snake[0]

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    console.log('Boundary collision detected')
    resetGame()
    return
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame()
      return
    }
  }
}

function resetGame() {
  console.log('Resetting game...')
  clearInterval(gameInterval)
  gameInterval = null
  snake = [{ x: 10, y: 10 }]
  food = generateFood()
  direction = 'right'
  gameSpeedDelay = 200
  gameStarted = false
  updateScore()
  updateHighScore()

  // Hide food element if it exists
  const foodElement = document.getElementById('food')
  if (foodElement) {
    foodElement.classList.remove('visible')
  }

  startButtonText.textContent = 'Game Over! Press Space to Restart'
  startButtonText.style.display = 'block'
  logo.style.display = 'block'
}

function updateScore() {
  const currentScore = snake.length - 1
  score.textContent = currentScore.toString().padStart(3, '0')
}

function stopGame() {
  clearInterval(gameInterval)
  gameStarted = false
  startButtonText.style.display = 'block'
  logo.style.display = 'block'
}

function updateHighScore() {
  const currentScore = snake.length - 1
  if (currentScore > highScore) {
    highScore = currentScore
    highScoretext.textContent = highScore.toString().padStart(3, '0')
    highScoretext.style.display = 'block'
  }
}

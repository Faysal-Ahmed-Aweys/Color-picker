const colors = [
  "red", "blue", "green", "yellow", "purple", "orange",
  "pink", "brown", "cyan", "magenta", "lime", "teal",
  "indigo", "maroon", "navy", "gold", "olive", "coral",
  "salmon", "skyblue", "tan", "thistle", "violet", "wheat"
];

let targetColor;
let resultMessage;
let currentLevel = 1;
let originalNumColorOptions = 3; // Track the original number of color options for each level
let numColorOptions = originalNumColorOptions;
let timerSeconds = 10;
let timerInterval;
let score = 0;

function startGame() {
  initializeGame();
  document.getElementById('next-level').disabled = true;
}

function initializeGame() {
  targetColor = getRandomColor();
  resultMessage = document.getElementById('result-message');
  resultMessage.textContent = '';
  resetTimer();  // Reset the timer when initializing the game
  displayColor();
  displayColorOptions();
  updateLevelText();
  updateScore();
}

function nextLevel() {
  if (resultMessage.textContent === 'Correct! Well done.') {
    currentLevel++;
    if (currentLevel <= 15) {
      originalNumColorOptions++;
      numColorOptions = originalNumColorOptions;
    }
  }

  timerSeconds += 5;
  initializeGame();
  document.getElementById('next-level').textContent = 'Next Level';
  document.getElementById('next-level').disabled = true;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerSeconds = 10;  // Reset the timer to its initial value
  timerInterval = setInterval(updateTimer, 1000);
  updateTimer();
}

function updateTimer() {
  const timerDisplay = document.getElementById('timer');
  timerDisplay.textContent = `Time left: ${timerSeconds}s`;

  if (timerSeconds <= 0) {
    resultMessage.textContent = 'Time is up! Click "Try Again" to reshuffle the same level.';
    clearInterval(timerInterval);
    deductPoints();
    disableColorOptions(); // Disable color options when time runs out
    document.getElementById('next-level').textContent = 'Try Again';
    document.getElementById('next-level').disabled = false;
  }

  timerSeconds--;
}

function disableColorOptions() {
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.style.pointerEvents = 'none'; // Disable pointer events to prevent clicking
  });
}


function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function displayColor() {
  const colorDisplay = document.getElementById('color-display');
  colorDisplay.style.backgroundColor = targetColor;
}

const colorLabels = {
  "red": "R",
  "blue": "B",
  "green": "G",
  "yellow": "Y",
  "purple": "P",
  "orange": "O",
  "pink": "P",
  "brown": "Br",
  "cyan": "C",
  "magenta": "M",
  "lime": "L",
  "teal": "Te",
  "indigo": "I",
  "maroon": "Ma",
  "navy": "N",
  "gold": "Go",
  "olive": "O",
  "coral": "C",
  "salmon": "S",
  "skyblue": "S",
  "tan": "T",
  "thistle": "Th",
  "violet": "V",
  "wheat": "W"
};


function displayColorOptions() {
  const colorOptionsContainer = document.getElementById('color-options');
  colorOptionsContainer.innerHTML = '';

  const shuffledColors = colors.slice().sort(() => Math.random() - 0.5);
  const selectedColors = Array.from(new Set(shuffledColors.slice(0, numColorOptions - 1)));
  selectedColors.push(targetColor);

  const shuffledLabels = Object.values(colorLabels).sort(() => Math.random() - 0.5);
  const selectedLabels = Array.from(new Set(shuffledLabels.slice(0, numColorOptions - 1)));
  selectedLabels.push(colorLabels[targetColor]);

  // Ensure uniqueness of both colors and labels
  const uniquePairs = Array.from(new Set(selectedColors.map((color, index) => ({ color, label: selectedLabels[index] }))));

  uniquePairs.forEach(({ color, label }) => {
    const colorOption = document.createElement('div');
    colorOption.className = 'color-option';

    if (colorBlindMode) {
      const labelElement = document.createElement('span');
      labelElement.textContent = label;
      labelElement.style.color = color; // Set text color to match the color in color-blind mode
      colorOption.appendChild(labelElement);
    } else {
      colorOption.style.backgroundColor = color;
    }

    colorOption.addEventListener('click', () => checkGuess(color));
    colorOptionsContainer.appendChild(colorOption);
  });
}







function updateDifficulty() {
  numColorOptions = Math.min(currentLevel + 2, colors.length); // Adjust difficulty based on the level
  timerSeconds = 10 + currentLevel * 2; // Adjust timer duration based on the level
}

// ...

let colorBlindMode = false;

function toggleColorBlindMode() {
  colorBlindMode = !colorBlindMode;
  initializeGame();
}

function displayColorOptions() {
  const colorOptionsContainer = document.getElementById('color-options');
  colorOptionsContainer.innerHTML = '';

  // Shuffle the colors
  const shuffledColors = colors.slice().sort(() => Math.random() - 0.5);

  // Ensure the target color is unique
  let selectedColors = [targetColor];

  // Add unique colors until we reach the desired number of options
  while (selectedColors.length < numColorOptions) {
    const nextColor = shuffledColors.pop();
    if (!selectedColors.includes(nextColor)) {
      selectedColors.push(nextColor);
    }
  }

  // Shuffle the labels
  const shuffledLabels = Object.values(colorLabels).sort(() => Math.random() - 0.5);
  const selectedLabels = Array.from(new Set(shuffledLabels.slice(0, numColorOptions)));

  // Ensure uniqueness of both colors and labels
  const uniquePairs = Array.from(new Set(selectedColors.map((color, index) => ({ color, label: selectedLabels[index] }))));

  uniquePairs.forEach(({ color, label }) => {
    const colorOption = document.createElement('div');
    colorOption.className = 'color-option';

    if (colorBlindMode) {
      const labelElement = document.createElement('span');
      labelElement.textContent = label;
      labelElement.style.color = color; // Set text color to match the color in color-blind mode
      colorOption.appendChild(labelElement);
    } else {
      colorOption.style.backgroundColor = color;
    }

    colorOption.addEventListener('click', () => checkGuess(color));
    colorOptionsContainer.appendChild(colorOption);
  });
}




function checkGuess(guess) {
  if (guess === targetColor) {
    resultMessage.textContent = 'Correct! Well done.';
    clearInterval(timerInterval);
    awardPoints();
    setTimeout(nextLevel, 1000);
    document.getElementById('next-level').textContent = 'Next Level';
    document.getElementById('next-level').disabled = false;
  } else {
    resultMessage.textContent = 'Incorrect. Try again!';
    deductPoints();
    document.getElementById('next-level').disabled = true;
  }
}




function awardPoints() {
  const points = Math.max(1, Math.floor(timerSeconds / 2));
  score += points;
  updateScore();
}

function deductPoints() {
  score = Math.max(0, score - 5);
  updateScore();
}

function updateScore() {
  document.getElementById('score-counter').textContent = score;
}

function updateLevelText() {
  document.getElementById('next-level').disabled = true;
  resultMessage.textContent = `Level ${currentLevel} - Guess the color: ${targetColor}`;
  resetTimer();
}

// Initialize the game
initializeGame();

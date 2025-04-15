let sentence = '';
let startTime, intervalId;
let finished = false;
let gameActive = false;

function fetchSentence() {
    fetch('/sentence')
        .then(res => res.json())
        .then(data => {
            sentence = data.sentence;
            renderSentenceBox(''); // blank input for new round
        });
}

function renderSentenceBox(userInput) {
    const box = document.getElementById('sentence-box');
    let html = '';
    let correct = true;
    for (let i = 0; i < sentence.length; i++) {
        if (userInput[i] === undefined) {
            html += `<span>${sentence[i]}</span>`;
        } else if (userInput[i] === sentence[i] && correct) {
            html += `<span class="correct">${sentence[i]}</span>`;
        } else {
            html += `<span class="incorrect">${sentence[i]}</span>`;
            correct = false;
        }
    }
    box.innerHTML = html;
}

function updateProgressBar(userInput) {
    const progress = Math.min(100, Math.floor((userInput.length / sentence.length) * 100));
    document.getElementById('progress-bar').style.width = progress + '%';
}

function startGame() {
    fetchSentence();
    document.getElementById('input-box').value = '';
    document.getElementById('input-box').disabled = false;
    document.getElementById('input-box').focus();
    document.getElementById('results').style.display = 'block';
    document.getElementById('timer').textContent = 'Time: 0s';
    document.getElementById('wpm').textContent = 'WPM: 0';
    document.getElementById('accuracy').textContent = 'Accuracy: 0%';
    document.getElementById('game-message').textContent = '';
    document.getElementById('game-message').style.color = '#7d2ae8';
    document.getElementById('progress-bar').style.width = '0%';
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'none';
    finished = false;
    gameActive = true;
    startTime = null;
    clearInterval(intervalId);
}

function endGame() {
    finished = true;
    gameActive = false;
    clearInterval(intervalId);
    document.getElementById('input-box').disabled = true;
    calculateResults();
    document.getElementById('game-message').textContent = 'Game Over!';
    document.getElementById('game-message').style.color = '#e74c3c';
    document.getElementById('game-message').animate([
        { transform: 'scale(1)', color: '#e74c3c' },
        { transform: 'scale(1.15)', color: '#e74c3c' },
        { transform: 'scale(1)', color: '#e74c3c' }
    ], { duration: 600, easing: 'ease' });
    document.getElementById('restart-btn').style.display = 'inline-block';
}

function calculateResults() {
    const input = document.getElementById('input-box').value;
    const timeElapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
    const wordsTyped = input.trim().split(/\s+/).filter(Boolean).length;
    const wpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
        if (input[i] === sentence[i]) correctChars++;
    }
    const accuracy = sentence.length ? Math.round((correctChars / sentence.length) * 100) : 0;
    document.getElementById('timer').textContent = `Time: ${Math.floor(timeElapsed)}s`;
    document.getElementById('wpm').textContent = `WPM: ${wpm}`;
    document.getElementById('accuracy').textContent = `Accuracy: ${accuracy}%`;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('results').style.display = 'none';
    document.getElementById('input-box').disabled = true;
    document.getElementById('start-btn').style.display = 'inline-block';
    document.getElementById('restart-btn').style.display = 'none';
    document.getElementById('game-message').textContent = '';
    document.getElementById('progress-bar').style.width = '0%';
    renderSentenceBox('');

    const inputBox = document.getElementById('input-box');
    inputBox.addEventListener('input', () => {
        if (!gameActive || finished) return;
        if (!startTime) {
            startTime = Date.now();
            intervalId = setInterval(calculateResults, 200);
        }
        renderSentenceBox(inputBox.value);
        updateProgressBar(inputBox.value);
        calculateResults();
        if (inputBox.value === sentence && !finished) {
            endGame();
            document.getElementById('progress-bar').style.width = '100%';
        }
    });

    document.getElementById('start-btn').addEventListener('click', () => {
        startGame();
    });
    document.getElementById('restart-btn').addEventListener('click', () => {
        startGame();
    });
});

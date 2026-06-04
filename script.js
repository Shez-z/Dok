class GuessNumberGame {
    constructor() {
        this.targetNumber = 0;
        this.attempts = 0;
        this.playerName = '';
        this.isDayGame = false;
        this.maxAttempts = 50;

        this.initElements();
        this.loadRecords();
        this.startNewGame();
    }

    initElements() {
        this.nameInput = document.getElementById('playerName');
        this.guessInput = document.getElementById('guessInput');
        this.checkBtn = document.getElementById('checkBtn');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.dayNumberBtn = document.getElementById('dayNumberBtn');
        this.clearRecordsBtn = document.getElementById('clearRecordsBtn');
        this.hint = document.getElementById('hint');
        this.attemptsDisplay = document.getElementById('attempts');
        this.recordsBody = document.getElementById('recordsBody');

   
        this.checkBtn.addEventListener('click', () => this.handleAnswer());
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.dayNumberBtn.addEventListener('click', () => this.startDayGame());
        this.clearRecordsBtn.addEventListener('click', () => this.clearRecords());

        this.guessInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                this.handleAnswer(); 
            }
        });
    }

    getRandomNumber(min = 1, max = 5000) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    startNewGame() {
        this.isDayGame = false;
        this.targetNumber = this.getRandomNumber();
        this.attempts = 0;
        this.updateAttemptsDisplay();
        this.clearHint();
        this.enableInput();
        this.guessInput.focus();
    }

    startDayGame() {
        this.isDayGame = true;
        this.maxAttempts = this.getRandomNumber(10, 50);
        this.targetNumber = this.getRandomNumber();
        this.attempts = 0;
        this.updateAttemptsDisplay();
        this.showHint(`Число дня! У вас есть ${this.maxAttempts} попыток!`);
        this.enableInput();
        this.guessInput.focus();
    }

    handleAnswer() {
        const guess = parseInt(this.guessInput.value);

        if (!guess || guess < 1 || guess > 5000) {
            this.showHint('Введите число от 1 до 5000!');
            return;
        }

        this.attempts++;
        this.updateAttemptsDisplay();

        if (guess === this.targetNumber) {
            this.showHint(`Поздравляем! Вы угадали число ${this.targetNumber} за ${this.attempts} попыток!`);
            this.saveRecord();
            this.disableInput();
        } else if (this.isDayGame && this.attempts >= this.maxAttempts) {
            this.showHint(`Игра окончена! Число дня было: ${this.targetNumber}. Попробуйте снова!`);
            this.disableInput();
        } else if (guess < this.targetNumber) {
            this.showHint('Загаданное число больше!');
        } else {
            this.showHint('Загаданное число меньше!');
        }

        this.guessInput.value = '';
        this.guessInput.focus();
    }

    saveRecord() {
        this.playerName = this.nameInput.value || 'Аноним';

        const newRecord = {
            name: this.playerName,
            attempts: this.attempts,
            date: new Date().toLocaleDateString()
        };

        let records = JSON.parse(localStorage.getItem('guessGameRecords')) || [];
        records.push(newRecord);

        records.sort((a, b) => a.attempts - b.attempts);

        if (records.length > 10) {
            records = records.slice(0, 10);
        }

        localStorage.setItem('guessGameRecords', JSON.stringify(records));
        this.displayRecords();
    }

    loadRecords() {
        const records = JSON.parse(localStorage.getItem('guessGameRecords')) || [];
        this.displayRecords(records);
    }

    displayRecords(records = null) {
        if (records === null) {
            records = JSON.parse(localStorage.getItem('guessGameRecords')) || [];
        }

        this.recordsBody.innerHTML = '';

        records.forEach((record, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${record.name}</td>
                <td>${record.attempts}</td>
            `;
            this.recordsBody.appendChild(row);
        });
    }

    clearRecords() {
        localStorage.removeItem('guessGameRecords');
        this.displayRecords([]);
        this.showHint('Таблица рекордов очищена!');
    }

    updateAttemptsDisplay() {
        this.attemptsDisplay.textContent = `Попыток: ${this.attempts}`;
    }

    showHint(message) {
        this.hint.textContent = message;
    }

    clearHint() {
        this.hint.textContent = '';
    }

    enableInput() {
        this.guessInput.disabled = false;
        this.checkBtn.disabled = false;
    }

    disableInput() {
        this.guessInput.disabled = true;
        this.checkBtn.disabled = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GuessNumberGame();
});
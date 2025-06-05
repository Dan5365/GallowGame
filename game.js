import {
    submitBtn, userInput, restart, attemptsLeftHtml, divGapsContainer, alertBorder,
    countWin, continueBtn, alphabetBtns, gallows, stickHead, stickBody, stickArmLeft, stickArmRight,
    stickLegLeft, stickLegRight, rope
} from "./querySelectors.js";

const arrayOfWords = ["вентилятор", "какао", "сыр"];
let min = 0;
let max = arrayOfWords.length;
let attemptsLeft = 7;
let winCounter = 0;

alphabetBtns.forEach(button => {
    button.addEventListener('click', () => {
        userInput.value += button.textContent;

    });
});

// function AutoEnter() {

//     userInput.addEventListener("keydown", () => { });
// }

restart.addEventListener("click",
    function refreshPage() {
        location.reload();
    })

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

let randomNumber = getRandomNumber(min, max);
let selectedWord = arrayOfWords[randomNumber];
let lettersLength = selectedWord.length;
let originalWord = selectedWord.split("").sort().join("");
let divsGapHolderArray = [];
for (let i = 0; i < lettersLength; i++) {
    let divHtml = document.createElement("div");
    divHtml.className = "div-word-gaps";
    divHtml.style.fontSize = "45px";
    divHtml.style.textAlign = "left";
    divGapsContainer.appendChild(divHtml);
    divsGapHolderArray.push(divHtml);
}

function isDigit(correctUserGuessedLetters) {
    return /^\d+$/.test(correctUserGuessedLetters);
    //^ - начало строки
    // /d - одна цифра (0-9)
    // /d+ - одна или более цифр
    //$ - конец строки 
    //.test() - Возвращает true,если строка полностью состоит из цифр
}

function showError(message) {
    alertBorder.innerHTML =
        `<ion-icon class="ion" size="medium" name="close-circle"></ion-icon>${message}`;
    alertBorder.classList.add("error-holder");
    alertBorder.style.display = "flex";
    setTimeout(function () {
        alertBorder.style.display = "none";
    }, 5500);
}

let userInputArray = [];
let userLetterStorage = "";
let correctUserGuessedLetters = "";
function letterCheck(userInput) {
    if (userInput === "") {
        showError("Пустой Текст");
        return false;
    }
    if (userInput.length !== 1) {
        showError("Введите только одну букву!");
        return false;
    }
    if (correctUserGuessedLetters.includes(userInput) || userLetterStorage.includes(userInput)) {
        showError("Это слово уже было отгадано!");
        return false;
    }
    if (isDigit(userInput)) {
        showError("Введите только буквы!");
        return false;
    }
    return true;
}



    
    
    
function handleCorrectGuess(userInput) {
    for (let i = 0; i < lettersLength; i++) {
        if (selectedWord[i] == userInput) {
            divsGapHolderArray[i].textContent = selectedWord[i];
            userInputArray.push(userInput);
            correctUserGuessedLetters = userInputArray.join("");
        }
    }
}

function handleIncorrectGuess(userInput) {
    userLetterStorage += userInput;
    if (attemptsLeft > 1) {
        attemptsLeft--;
        updateGallowsDisplay();
    } else {
        endGame()
    }
}

function updateGallowsDisplay() {
    switch (attemptsLeft) {
        case 6:
            gallows.style.display = 'block';
            break;
        case 5:
            rope.style.display = 'block';
            stickHead.style.display = 'block';
            break;
        case 4:
            stickBody.style.display = 'block';
            break;
        case 3:
            stickArmLeft.style.display = 'block';
            break;
        case 2:
            stickArmRight.style.display = 'block';
            break;
        case 1:
            stickLegLeft.style.display = 'block'
            break;
    }
    attemptsLeftHtml.innerHTML = `Попыток осталось: ${attemptsLeft}`;
}

function endGame() {
    stickLegRight.style.display = 'block'
    let userInput = document.querySelector(".user-input")
    userInput.style.backgroundColor = 'red'
    userInput.placeholder = 'Game Over'
    alert("Ты Пройграл!");
    attemptsLeft--;
    userInput.disabled = true;
}

let userInputFinalCheck = "";
function checkWin() {
    let userInputFinalCheck = correctUserGuessedLetters.split("").sort().join("");
    userInput.value = "";

    if (correctUserGuessedLetters.length == originalWord.length && originalWord == userInputFinalCheck) {
        alert("Ты Выйграл!");
        continueBtn.style.display = "block";
        winCounter++;
        localStorage.setItem("localWinCounter", winCounter);
        let localWinCounter = parseInt(localStorage.getItem("localWinCounter"));

        document.querySelector(".user-input").style.backgroundColor = 'lime'
        document.querySelector(".user-input").placeholder = 'Win!'
        countWin.innerHTML = `Кол-во Выйгрышей: ${localWinCounter}`;
        userInput.disabled = true;
    }
};

submitBtn.addEventListener("click", function () {
    let userInput = document.querySelector(".user-input").value.trim().toLowerCase();

    if (!letterCheck(userInput)) {
        return;
    }
    if (originalWord.includes(userInput)) {
        handleCorrectGuess(userInput)
    } else {
        handleIncorrectGuess(userInput)
    }
    checkWin();
});

if (correctUserGuessedLetters.length == selectedWord.length && originalWord == userInputFinalCheck) {
    alert("Ты Выйграл!");
    continueBtn.style.display = "block";
    winCounter++;
    userInput.disabled = true
    localStorage.setItem("localWinCounter", winCounter);
    let localWinCounter = parseInt(localStorage.getItem("localWinCounter"));

    document.querySelector(".user-input").style.backgroundColor = 'lime'
    document.querySelector(".user-input").placeholder = 'Win!'
    countWin.innerHTML = `Кол-во Выйгрышей: ${localWinCounter}`;
}

window.onload = function () {
    let savedWins = localStorage.getItem("localWinCounter");

    if (savedWins) {
        winCounter = parseInt(savedWins);
        countWin.innerHTML = `Кол-во Выйгрышей: ${winCounter}`;
    }
};

continueBtn.addEventListener("click", () => {
    continueBtn.style.display = "none";
});

const categories = ["Sports", "Animals", "Science & Nature", "History", "Art"]

/* add event listeners for start & reset buttons here */
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("resetButton").addEventListener("click", resetGame);
document.getElementById("submitResponse").addEventListener("click", checkResponse);
document.getElementById("feedback").innerHTML = "Select a Question";


/* complete functions below */

function startGame() {
    // Starts the timer
    startTimer();
    window.localStorage.setItem("gameState", JSON.stringify({score: 0}));

    // Button and feedback stuff
    document.getElementById("startButton").disabled = true;
    document.getElementById("resetButton").disabled = false;

    // Tile stuff
    populateBoard();

    // Sets score to 0
    updateScore(0)

    // Waits for user response
    document.getElementById("submitResponse").addEventListener("click", checkResponse);
}

const getRandom = (categorieS) => {
    let categories = categorieS;
    for (let i = 0; i < 5; i++) {
        const ind = Math.floor(Math.random() * categories.length);
        //remove value from array
        const val = categories.splice(ind, 1);
        window.localStorage.setItem(`category${i}`, JSON.stringify(val));
    }
}


async function populateBoard() {
    // let cat=document.getElementsByClassName("category").innerHTML = "Test";
    // document.getElementsByClassName("category").innerHTML = "Test";

    //use the below link to randomize categories:
    let res;
    const response = await fetch("https://opentdb.com/api_category.php");
    await response.json().then(data => {
        res = data.trivia_categories;
        getRandom(res);

    });


    // https://opentdb.com/api_category.php

    // Set the HTML content of the corresponding element
    $(".category").each(function (index) {
        const val = JSON.parse(window.localStorage.getItem(`category${index}`))[0]
        $(this).html(val.name);
    });
    $(".question").each(function (index) {
        $(this).html((Math.floor(index / 5) + 1) * 10);
    });

    // Clickable questions
    for (let i = 0; i <= 24; i++) {
        document.getElementsByClassName("question")[i].addEventListener("click", viewQuestion);
        document.getElementsByClassName("question")[i].setAttribute('id', i);
    }
}


const getApiUrl = (categoryIndex, difficulty) => {
    const category = JSON.parse(window.localStorage.getItem(`category${categoryIndex}`))[0].id
    let apiDifficulty = "";

    switch (difficulty) {
        case 0:
        case 1:
            apiDifficulty = "easy";
            break;
        case 2:
        case 3:
            apiDifficulty = "medium";
            break;
        case 4:
            apiDifficulty = "hard";
            break;
        default:
            apiDifficulty = "easy";
    }
    return `https://opentdb.com/api.php?amount=1&category=${category}&difficulty=${apiDifficulty}&type=multiple`;
}

async function handleRequest(url) {
    const response = await fetch(url);
    const res = await response.json();
    return res.results[0]
}

async function viewQuestion() {

    // If id is set earlier, saving it to local storage
    window.localStorage.setItem("currentIndex", this.id);


    // Get the modal
    // Not using var makes it global
    modal = document.getElementById("qaModal");

    // Get the <span> element that closes the modal
    var closeX = document.getElementsByClassName("close")[0];

    // Display modal
    modal.style.display = "block";


    // When the user clicks on <span> (x), close the modal
    closeX.onclick = function () {
        modal.style.display = "none";
    }

    // get data from api based on category and value
    const category = Math.floor(this.id % 5);
    const difficulty = Math.floor(this.id / 5);

    const apiUrl = getApiUrl(category, difficulty);
    const question = await handleRequest(apiUrl)

    $("#questionArea p").html(question.question);

    const answers = [...question.incorrect_answers, question.correct_answer]
        .sort(() => (Math.random() > .5) ? 1 : -1);
    const indexCorrect = answers.indexOf(question.correct_answer);

    $("#answerArea label").each(function (index) {
        $(this).html(answers[index]);
    })

    const updatedQuestion = {...question, indexCorrect, difficulty}

    //store quesiton in local storage
    window.localStorage.setItem("question", JSON.stringify(updatedQuestion));

}

const updateScore = (score) => {
    const gameState = JSON.parse(window.localStorage.getItem("gameState"));
    gameState.score += score;
    $('#total').html(gameState.score);
    window.localStorage.setItem("gameState", JSON.stringify(gameState));
}

function checkResponse() {
    // checkResponse()
    // Determines whether the checked answer is correct, based on radio button attribute value
    // If the answer is correct, “Correct!” is displayed in <div id=”feedback”></div>
    // If answer is incorrect, displays the correct answer in the feedback div
    // Either adds (if correct) or subtracts (if incorrect) the question points to/from the overall total, and displays in <span id=”total”></span>
    // Removes text (point value) from the specific div of class question, so it appears blank.
    // Remove the event listened from that specific div of class question.

    const question = JSON.parse(window.localStorage.getItem("question"));
    const correctAnswer = question.correct_answer;
    let userAnswer = $("input[name='qa']:checked");
    userAnswer.length === 0 ? userAnswer = "No Answer" : userAnswer = userAnswer[0].nextElementSibling.innerHTML;

    if (userAnswer === "No Answer") return

    tempAlert(userAnswer === correctAnswer ? "Correct!" : `Incorrect! The correct answer is: ${correctAnswer}`, 3000, userAnswer === correctAnswer ? "#ccffccAA" : "#ffaaaaAA");
    updateScore((question.difficulty + 1) * 10 * (userAnswer === correctAnswer ? 1 : -1));

    /* for closing modal */
    modal.style.display = "none";
    let questionCell = document.getElementById(window.localStorage.getItem("currentIndex"));
    questionCell.removeEventListener("click", viewQuestion);
    questionCell.innerHTML = "";
}

function resetGame() {
    resetTimer();
    stopTimer();
    document.getElementById("feedback").innerHTML = "Click Start to begin.";
    document.getElementById("startButton").disabled = false;
    document.getElementById("resetButton").disabled = true;
    $(".category").html("");
    $(".question").html("");

    window.localStorage.setItem("gameState", JSON.stringify({score: 0}));
    updateScore(0);

}

function tempAlert(msg, duration, background) {
    var $el = $('<div class="tempAlert"></div>');
    $el.html(`<p>${msg}</p>`)
    $el.css('background-color', background);
    $('body').append($el);
    setTimeout(function () {
        $el.fadeOut('slow', function () {
            $(this).remove();
        });
    }, duration);
}


/*---------------------------------------------------------------------------------------------------------*/

/* JS for the stopwatch */

let hr = 0;
let min = 0;
let sec = 0;
let count = 0;
let timer;

function startTimer() {
    timer = setInterval(updateTimer, 10);
    //document.getElementById("stopButton").addEventListener("click", stopTimer);
}

function stopTimer() {
    clearInterval(timer);
}

function resetTimer() {
    clearInterval(timer);
    hr = min = sec = count = 0;
    updateDisplay();
}

function updateTimer() {
    count++;
    if (count === 100) {
        count = 0;
        sec++;
    }
    if (sec === 60) {
        sec = 0;
        min++;
    }
    if (min === 60) {
        min = 0;
        hr++;
    }
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('hr').innerText = hr.toString().padStart(2, '0');
    document.getElementById('min').innerText = min.toString().padStart(2, '0');
    document.getElementById('sec').innerText = sec.toString().padStart(2, '0');
    document.getElementById('count').innerText = count.toString().padStart(2, '0');
}
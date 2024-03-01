const categories = ["Sports", "Animals", "Science & Nature", "History", "Art"]

/* add event listeners for start & reset buttons here */
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("resetButton").addEventListener("click", resetGame);

/* complete functions below */

function startGame() {
    // Starts the timer
    startTimer();

    // Button and feedback stuff
    document.getElementById("feedback").innerHTML = "Select a Question";
    document.getElementById("startButton").disabled = true;
    document.getElementById("resetButton").disabled = false;

    // Tile stuff
    populateBoard();

    // Sets score to 0
    document.getElementById("total").innerHTML = "0";

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
        console.log(index)
        const val = JSON.parse(window.localStorage.getItem(`category${index}`))[0]
        console.log(val)
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


const getApiUrl = ({category, difficulty}) => {

    category = JSON.parse(window.localStorage.getItem(`category${category}`)).id;
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

    console.log(this.id)
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

    const apiUrl = getApiUrl({category, difficulty});
    const question = await handleRequest(apiUrl)

    console.log("Response Question: ", question);

    console.log("Question: ", question.question);
    $("#questionArea p").html(question.question);


}


function checkResponse() {


    /* for closing modal */
    //modal.style.display = "none";
}

function resetGame() {
    resetTimer();
    stopTimer();
    document.getElementById("feedback").innerHTML = "Click Start to begin.";
    document.getElementById("startButton").disabled = false;
    document.getElementById("resetButton").disabled = true;
    $(".category").html("");
    $(".question").html("");


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
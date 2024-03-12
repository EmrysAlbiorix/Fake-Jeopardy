// Array of categories
const categories = ["Sports", "Animals", "Science & Nature", "History", "Art"];

// Event listeners for buttons
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("resetButton").addEventListener("click", resetGame);
document.getElementById("submitResponse").addEventListener("click", checkResponse);
document.getElementById("feedback").innerHTML = "Select a Question";

// Function to start the game
function startGame() {
    startTimer(); // Start the timer
    window.localStorage.setItem("gameState", JSON.stringify({score: 0}));

    // Disable start button, enable reset button
    document.getElementById("startButton").disabled = true;
    document.getElementById("resetButton").disabled = false;

    // Populate board, set score to 0, and wait for user response
    populateBoard();
    updateScore(0);
    document.getElementById("submitResponse").addEventListener("click", checkResponse);
}

// Function to randomly select categories
const getRandomCategories = (categories) => {
    let tempCategories = categories.slice(); // Create a copy of categories array
    for (let i = 0; i < 5; i++) {
        const ind = Math.floor(Math.random() * tempCategories.length);
        const val = tempCategories.splice(ind, 1)[0]; // Remove value from array
        window.localStorage.setItem(`category${i}`, JSON.stringify([val])); // Store category in local storage
    }
}

// Function to populate the game board with categories and questions
async function populateBoard() {
    let res;
    const response = await fetch("https://opentdb.com/api_category.php"); // Fetch categories from API
    await response.json().then(data => {
        res = data.trivia_categories;
        getRandomCategories(res); // Get random categories
    });

    // Set category and question values
    $(".category").each(function (index) {
        // Get category value from local storage and set it to the corresponding element
        const val = JSON.parse(window.localStorage.getItem(`category${index}`))[0];
        $(this).html(val.name);
    });
    $(".question").each(function (index) {
        // Set question values based on index
        $(this).html((Math.floor(index / 5) + 1) * 10);
    });

    // Make questions clickable
    for (let i = 0; i <= 24; i++) {
        // Add click event listener to each question cell
        document.getElementsByClassName("question")[i].addEventListener("click", viewQuestion);
        document.getElementsByClassName("question")[i].setAttribute('id', i); // Set unique ID for each question
    }
}


// Function to get API URL based on category and difficulty
const getApiUrl = (categoryIndex, difficulty) => {
    const category = JSON.parse(window.localStorage.getItem(`category${categoryIndex}`))[0].id;
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

// Function to handle API request
async function handleRequest(url) {
    const response = await fetch(url); // Send request to API
    const res = await response.json(); // Get JSON response
    return res.results[0]; // Return the first result
}

// Function to display question
async function viewQuestion() {
    window.localStorage.setItem("currentIndex", this.id); // Save question index

    // Introduce a 0.5-second delay before displaying the modal
    setTimeout(() => {
        // Display modal
        modal = document.getElementById("qaModal");
        modal.style.display = "block";
    }, 500); // Half a second delay

    // Close modal function
    var closeX = document.getElementsByClassName("close")[0];
    closeX.onclick = function () {
        modal.style.display = "none";
    }

    // Get question data from API
    const category = Math.floor(this.id % 5);
    const difficulty = Math.floor(this.id / 5);
    const apiUrl = getApiUrl(category, difficulty);
    const question = await handleRequest(apiUrl); // Fetch question from API

    // Display question and answers
    $("#questionArea p").html(question.question);
    const answers = [...question.incorrect_answers, question.correct_answer].sort(() => (Math.random() > .5) ? 1 : -1);
    const indexCorrect = answers.indexOf(question.correct_answer);
    $("#answerArea label").each(function (index) {
        $(this).html(answers[index]);
    });

    // Store question in local storage
    const updatedQuestion = {...question, indexCorrect, difficulty};
    window.localStorage.setItem("question", JSON.stringify(updatedQuestion));
}


// Function to update score
const updateScore = (score) => {
    const gameState = JSON.parse(window.localStorage.getItem("gameState"));
    gameState.score += score;
    $('#total').html(gameState.score);
    window.localStorage.setItem("gameState", JSON.stringify(gameState));
}

// Function to check user response
function checkResponse() {
    // Retrieve the question from local storage
    const question = JSON.parse(window.localStorage.getItem("question"));
    const correctAnswer = question.correct_answer;

    // Get the user's answer
    let userAnswer = $("input[name='qa']:checked");
    userAnswer.length === 0 ? userAnswer = "No Answer" : userAnswer = userAnswer[0].nextElementSibling.innerHTML; // Set user answer, default to "No Answer" if none selected

    // Display feedback to the user
    const feedbackElement = document.getElementById("feedback");
    // Show "Correct!" if user's answer matches the correct answer, else display "Incorrect!" with the correct answer
    feedbackElement.innerHTML = userAnswer === correctAnswer ? "Correct!" : `Incorrect! The correct answer is: ${correctAnswer}`;
    feedbackElement.style.backgroundColor = userAnswer === correctAnswer ? "#ccffccAA" : "#ffaaaaAA"; // Set background color based on correctness

    // Update score based on question difficulty and correctness
    updateScore((question.difficulty + 1) * 10 * (userAnswer === correctAnswer ? 1 : -1)); // Update score

    // Reset feedback after 3 seconds
    setTimeout(() => {
        feedbackElement.innerHTML = "Select a Question"; // Reset feedback message
        feedbackElement.style.backgroundColor = ""; // Reset background color
    }, 3000);

    // Close modal and mark the question as answered
    modal.style.display = "none"; // Hide modal
    let questionCell = document.getElementById(window.localStorage.getItem("currentIndex"));
    questionCell.removeEventListener("click", viewQuestion); // Remove click event listener
    questionCell.innerHTML = ""; // Clear the question cell
}


// Function to reset the game
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

/*---------------------------------------------------------------------------------------------------------*/

// Stopwatch functionality
let hr = 0;
let min = 0;
let sec = 0;
let count = 0;
let timer;

function startTimer() {
    timer = setInterval(updateTimer, 10);
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


const categories=["Sports", "Animals", "Science & Nature", "History", "Art"]

/* add event listeners for start & reset buttons here */
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("resetButton").addEventListener("click", resetGame);

/* complete functions below */

function startGame(){
    // Starts the timer
    startTimer();

    // Button and feedback stuff
    document.getElementById("feedback").innerHTML = "Select a Question";
    document.getElementById("startButton").disabled = true;
    document.getElementById("resetButton").disabled = false;

    // Tile stuff
    populateBoard();

    // Sets score to 0
    document.getElementById("total").innerHTML="0";

    // Waits for user response
    document.getElementById("submitResponse").addEventListener("click", checkResponse);
}

function populateBoard(){
    // let cat=document.getElementsByClassName("category").innerHTML = "Test";
    // document.getElementsByClassName("category").innerHTML = "Test";

    $(".category").html("category");
    $(".question").each(function(index) {
        $(this).html((Math.floor(index/5)+1)*10);
    });

    // Clickable questions
    for (let i = 0; i <= 24; i++) {
        document.getElementsByClassName("question")[i].addEventListener("click", viewQuestion);
        document.getElementsByClassName("question")[i].setAttribute('id', i);
    }
}






function viewQuestion(){

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
    closeX.onclick = function() {
        modal.style.display = "none";
    }




}


function checkResponse(){





    /* for closing modal */
    //modal.style.display = "none";
}

function resetGame(){
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

const categories=["Sports", "Animals", "Science & Nature", "History", "Art"]

/* add event listeners for start & reset buttons here */
document.getElementById("startButton").addEventListener("click", startGame)
document.getElementById("resetButton").addEventListener("click", resetGame)

function start2stop() {
    document.getElementById("startButton").innerHTML = "Stop";
}

function stop2start() {
    document.getElementById("startButton").innerHTML = "Start";
}

/* Highlights the button when mouseover
function myMouseoverHandler(event) {
    event.target.style.backgroundColor = "white";
}
*/

/* Stops highlight after mouse leaves
function myMouseoutHandler(event) {
    event.target.style.backgroundColor = "grey";
}
*/

/* complete functions below */

function startGame(){
    start2stop();
    document.getElementById("startButton").disabled = true;
    document.getElementById("resetButton").disabled = false;
    populateBoard();

    // Sets score to 0
    document.getElementById("total").innerHTML="0";

    // Waits for user response
    document.getElementById("submitResponse").addEventListener("click", checkResponse);
}

function populateBoard(){
    document.getElementsByClassName("category").innerHTML = "Test";
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
    stop2start();
    document.getElementById("startButton").disabled = false;
    document.getElementById("resetButton").disabled = true;




}
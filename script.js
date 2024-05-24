var gameBoard = document.getElementById('gameBoard');
var numRowsInput = document.getElementById('nrows');
var numColsInput = document.getElementById('ncols');
var startGameDiv = document.getElementById('startGame');
var images = [];
var gridImages = [];
var numberOfRows;
var numberOfCols;
var selectedImage = null;
var selectedImagesLength = 0;
var block = false;

initializeImages();
function initializeImages() {
    for (var i = 0; i <= 10; i++) {
        images.push(i + ".png");
    }
}

function startGame() {
    
    gridImages = [];
    selectedImagesLength = 0;
    // get number of rows 
    numberOfRows = parseInt(numRowsInput.value);
    // get number of columns 
    numberOfCols = parseInt(numColsInput.value);

    selectedImage = null;

    block = false;

    validateRowsAndCols(numberOfRows,numberOfCols);
    // create grid images
    createGridImages(numberOfCols, numberOfRows);
    // hide start game inputs and button 
    // startGameDiv.style.display = 'none';


    createBoardImages(numberOfRows,numberOfCols);

    startTimer();
    startGameDiv.style.display = "none";
}

function validateRowsAndCols(numberOfRows,numberOfCols){
    if(numberOfRows %2 != 0 && numberOfCols %2 != 0 ){
        alert("number of rows or number of columns must be even");
        throw new Error();
    }
    if(numberOfCols > 20){
        alert("maximum number of cols allowed is 20 \n you can increase rows as you want !! ");
        throw new Error();
    }
}

function createBoardImages(numberOfRows,numberOfCols){

    var elementWidth = 100 / numberOfCols ;
    var boardElements = "";
    for(var rowIndex = 0; rowIndex < numberOfRows;rowIndex++){
        boardElements += "<tr>";
        for(var colIndex = 0; colIndex < numberOfCols;colIndex++){
            var girdImageIndex = (rowIndex * numberOfCols + colIndex);
            boardElements += createFlipableImage(girdImageIndex,elementWidth);     
        }
        boardElements += "</tr>";
    }
    gameBoard.innerHTML = boardElements;
}
function createFlipableImage(index,elementWidth){
    var flipableImage = `<td onClick="flipCard(this)" class="flip-card" style="width:${elementWidth}%;height:200px;">
    
    <img src="images/hiddenCard.png" selected="false" hidden-image-index="${index}" alt="Avatar" style="border: 2px solid black;width:100%;height:100%">
      
    
  </td>`;
  return flipableImage;
}

async function flipCard(td){
    
    if(block == true)
        return;
    
    if(td.firstElementChild.getAttribute("selected") == "true" )
        return;
    block = true;
    var hiddenImageIndex = parseInt(td.firstElementChild.getAttribute("hidden-image-index"));
    td.firstElementChild.setAttribute("src","images/" + gridImages[hiddenImageIndex]);
    await delay(500);
    validateCardsAreSame(td);
    block = false;
    
}
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  

function validateCardsAreSame(td){

    if(selectedImage == null){
        selectedImage = td.firstElementChild;
        selectedImage.setAttribute("selected","true");
    }
    else{

        if(gridImages[parseInt(selectedImage.getAttribute("hidden-image-index"))] == 
        gridImages[parseInt(td.firstElementChild.getAttribute("hidden-image-index"))]
        ){
            selectedImagesLength+=2;
            td.firstElementChild.setAttribute("selected","true");
            if(selectedImagesLength == gridImages.length){
                alert("Congratulations You won a " + numberOfRows +" * "+ numberOfCols + "\n what a great memory!!");
                resetGame();
            }
        }else{
            td.firstElementChild.setAttribute("selected","false");
            selectedImage.setAttribute("selected","false");
            td.firstElementChild.setAttribute("src","images/hiddenCard.png");
            selectedImage.setAttribute("src","images/hiddenCard.png")
        }

        selectedImage = null;
    }
}
function createGridImages(numberOfCols, numberOfRows) {

    var imageIndex = 0;
    shuffle(images);
    for (var i = 0; i < numberOfCols * numberOfRows; i += 2) {

        console.log(i + " image " + images[imageIndex] + " added twice");
        gridImages.push(images[imageIndex]);
        gridImages.push(images[imageIndex]);
        imageIndex += 1;
        if (imageIndex == images.length)
            imageIndex = 0;

    }
    gridImages.forEach(element => {
        console.log(i + " image " + element);
    });

    // randomly shuffle grid images 
    console.log("images shuffling");
    shuffle(gridImages);
    gridImages.forEach(element => {
        console.log(" image " + element);
    });

}
function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

function resetGame(){
    
    location.reload();
}

var timeLimitInMinutes = document.getElementById("selectedTime");
var timeLimitInSeconds;
var timerElement = document.getElementById('timer');
var timerInterval;
function everySecondTimerAction(){
    timeLimitInSeconds--;
    var minutes = Math.floor(timeLimitInSeconds / 60);
    var seconds = timeLimitInSeconds % 60;
  
    if (timeLimitInSeconds < 0) {

      timerElement.textContent = '00:00';
      clearInterval(timerInterval);
      return;
    }
  
    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    if (seconds == 0) {
      alert("Game Over!");
      location.reload(); 
    }

    timerElement.textContent = minutes + ':' + seconds;
  
}

function startTimer() {
    clearInterval(timerInterval);
    timeLimitInMinutes = parseInt(timeLimitInMinutes.value);
    timeLimitInSeconds = timeLimitInMinutes * 60;
    timerInterval = setInterval(everySecondTimerAction, 1000);
}


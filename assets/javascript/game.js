 /*
    Sound credits:
    Game win sound: https://freesound.org/people/zut50/sounds/162395/, Creative Commons License
    Game loss sound: https://freesound.org/people/RICHERlandTV/sounds/216090/, Attribution License
    Wrong guess sound: https://freesound.org/people/Autistic%20Lucario/sounds/142608/, Attribution License
    Correct guess sound: https://freesound.org/people/Mudkip2016/sounds/423930/, Creative Commons License
    */

   const nGuesses = 10;

   var guessesLeft;
   var secretWord = "";
   var displayArr = [];
   var guessedArr = [];
   var wins = 0;
   var losses = 0;
   var winningGameSound;
   var losingGameSound;
   var correctGuessSound;
   var wrongGuessSound;




   function getSecretWord() {
     var words = ["alan turing", "algorithm", "analogy", "artificial intelligence", "autobiographical memory", "bayesian network", "change blindness", "cognitive bias", "cognitive frame", "cognitive neuroscience", "cognitive neuroscience", "cognitive psychology",
       "computational modeling", "connectionism", "consciousness", "data structure", "declarative memory", "deduction", "distributed cognition", "dopamine", "duality", "embodied cognition", "emotion", "flashbulb memories", "george lakoff", "george miller",
       "hebbian learning", "hippocampus", "holistic processing", "howard gardner", "induction", "intelligence", "interdisciplinary", "jean piaget", "language", "learning", "linguistics", "logic", "marvin minsky", "memory", "mental model", "mental representation",
       "metaphors", "neural network", "neuron", "neuroscience", "neurotransmitter", "noam chomsky", "perception", "philosophy", "prefontal cortex", "procedural memory", "rationalism", "representation", "retrival failure", "robot", "schema", "selective attention",
       "seymour papert", "situated action", "situated cognition", "steven pinker", "spike train", "symbolic model", "synapse", "thought experiment", "whorf hypothesis"];
     var size = words.length;
     return words[Math.floor(Math.random() * size)];
   }

   function createDisplayArr(word) {
     var displayArr = word.split("");
     displayArr = displayArr.map((item) => {
       return ((item === " ") ? " " : "_")
     })
     return displayArr;
   }

   function updateDisplay(let) {
     var letter = let.toLowerCase();
     for (var i = 0; i < secretWord.length; i++) {
       if ((secretWord.charAt(i)).toLowerCase() === letter)
         displayArr[i] = letter;
     }
     displayWord();
   }

   function displayWord() {
     document.querySelector("#word-display").innerHTML = displayArr.join("&nbsp;&nbsp;");
   }

   function addToGuessedArr(char) {
     guessedArr.push(char.toUpperCase());
   }

   function displayGuessedArr(char) {
     if (char) { // if the user has guessed a letter
       var spaces = "&nbsp;&nbsp;";
       addToGuessedArr(char);
       document.querySelector("#guessed-display").innerHTML = guessedArr.join(spaces);
     } else { // if we are displaying this for the first time, before any letters have been guessed
       document.querySelector("#guessed-display").innerHTML = "[none yet]";
     }
   }


   function gameIsWon() {
     var isWon = true;
     var letterPattern = /[a-z]| /i;

     for (var i = 0; i < displayArr.length; i++) {
       if (!letterPattern.test(displayArr[i])) {
         isWon = false;
         break;
       }
     }
     return isWon;
   }

   function gameIsLost() {
     return (guessesLeft === 0);
   }

   function isCorrectGuess(letter) {
     return secretWord.includes(letter.toLowerCase());
   }



   // check that guess is a letter, and that it has not already been guessed
   function isValidGuess(guess) {
     var isLetter = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(guess) !== -1;
     var retVal = (isLetter && !guessedArr.includes(guess.toUpperCase()));
     return retVal;
   }

   function decreaseGuesses() {
     guessesLeft--;
   }

   function initSounds() {
     correctGuessSound = document.createElement("AUDIO");
     correctGuessSound.setAttribute("src", "assets/sounds/correctGuess.wav");
     correctGuessSound.setAttribute("preload", "auto");

     wrongGuessSound = document.createElement("AUDIO");
     wrongGuessSound.setAttribute("src", "assets/sounds/wrongGuess.wav");
     wrongGuessSound.setAttribute("preload", "auto");

     winningGameSound = document.createElement("AUDIO");
     winningGameSound.setAttribute("src", "assets/sounds/wonGame.mp3");
     winningGameSound.setAttribute("preload", "auto");

     losingGameSound = document.createElement("AUDIO");
     losingGameSound.setAttribute("src", "assets/sounds/lostGame.mp3");
     losingGameSound.setAttribute("preload", "auto");
   }

   function setupGame() {
     initSounds();
     resetGame();
   }

   function resetGame() {
     guessedArr = [];
     guessesLeft = nGuesses;
     secretWord = getSecretWord();
     console.log("The secret word is: " + secretWord) // purposefully left this line in for now, for easier testing by TAs.
     displayArr = createDisplayArr(secretWord);
     displayWord();
     displayGuessedArr();
     displayWinsCount();
     displayGuessesCounter();

   }

   function displayWinsCount() {
       document.getElementById("wins-display").innerText = wins;
       document.getElementById("losses-display").innerText = losses;
   }

   function displayGuessesCounter() {
      document.getElementById("guesses-counter").textContent = guessesLeft;
   }

   // displays a winning or losing message briefly when gamne is won or lost
   function flashMessage(msg, delay) {
      var msgNode = document.getElementById("msg-display");
      msgNode.innerHTML = msg;

      setTimeout(function () { msgNode.innerHTML = "&nbsp;" }, delay);

   }

   function doWinningStuff() {
      var winMsg = "Congratulations, you won! A new game will start automatically in a few seconds.";

      winningGameSound.play();
      flashMessage(winMsg, 5000);
      wins++;
      displayWinsCount();
      setTimeout(resetGame, 5000);
   }

   function doLosingStuff() {
      var loseMsg = "Sorry, you used up all your guesses before guessing '" + secretWord + "'." +
       " A new game will start automatically in a few seconds.";

      losingGameSound.play();
      flashMessage(loseMsg, 5000);
      losses++;
      displayWinsCount();
      setTimeout(resetGame, 5000);
   }


   function doWrongGuessStuff() {
      wrongGuessSound.play();
      decreaseGuesses();
      displayGuessesCounter();
   }

   function doCorrectGuessStuff(userKey) {
      updateDisplay(userKey);
      correctGuessSound.play();
   }

   // business logic
   document.onkeyup = function (event) {
     var userKey = event.key;

     if (isValidGuess(userKey)) { // guess is a letter and has not already been guessed

       displayGuessedArr(userKey);

       if (isCorrectGuess(userKey)) { // if guessed letter is in the mystery word(s)
         doCorrectGuessStuff(userKey);

         if (gameIsWon()) {
           doWinningStuff();
         }

       } else { // the user has guessed a letter that isn't in the mystery word(s)
         doWrongGuessStuff();

         if (gameIsLost()) {
           doLosingStuff();

         } else { // game is not yet lost and will continue
           // nothing here right now, maybe later
         }
       }
     }
   }

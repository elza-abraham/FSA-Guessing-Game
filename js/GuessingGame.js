
var Game = function() {
    this.playersGuess = null;
    this.winningNumber = generateWinningNumber();
    this.pastGuesses = [];
}

function generateWinningNumber() {
    return Math.ceil(Math.random() * 100);
}


function newGame() {
    return new Game(); //check that old game !== new game
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
    if (isNaN(guess) || guess < 1 || guess > 100) {
        throw 'That is an invalid guess.';
    }
    this.playersGuess = guess;
    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
        $('#hint,#submit').prop('disabled', true);
        $('#subtitle').text('Press Reset button To reset the game.');
        return 'You Win!'
    }
    if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
        return 'You have already guessed that number.';
    }
    else {
        this.pastGuesses.push(this.playersGuess);
        if (this.pastGuesses.length === 5) {
            $('#hint,#submit').prop('disabled', true);
            $('#subtitle').text('Press Reset button To reset the game.');
            return 'You Lose.';
        }
        else {
            var diff = this.difference();
            if (diff < 10) return 'You\'re burning up!';
            else if (diff < 25) return 'You\'re lukewarm.';
            else if (diff < 50) return 'You\'re a bit chilly.';
            else return 'You\'re ice cold!';
        }
    }
}

Game.prototype.provideHint = function() {
    var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hintArray);
}

function shuffle(arr) {
   for (var i = arr.length - 1; i > 0; i--) {
       var randomIndex = Math.floor(Math.random() * (i + 1));
       var temp = arr[i];
       arr[i] = arr[randomIndex];
       arr[randomIndex] = temp;
    }
    return arr;
}

$(document).ready(function() {
    var game =  new Game();
    console.log('Winning number is :' + game.winningNumber);
    $('#players-input').keypress(function(event){
        if (event.which == 13){
            getInput();
        }
    });
    $('#submit').click(function() {
        getInput();
    });
    $('#hint').click(function() {
        var hint = game.provideHint();
        $('#title').text('The winning number is among [' + hint + ']');
    });
    $('#reset').click(function() {
        game =  newGame();
        $('#title').text('The Number Guessing  Game ');
        $('#subtitle').text('Play by guessing a number between 1 & 100');
        $('#hint,#submit').prop('disabled', false);
        $('#players-input').focus();
        $('#players-input').val('');
    });
    function getInput(){
        var inputGuess = $('#players-input').val();
        $('#players-input').val('');
        try {
            var output = game.playersGuessSubmission(parseInt(inputGuess, 10));
            $('#title').text(output);
            if ( output === 'You Lose.'){
                updateList();
            }
            if (output !== 'You Win!'){
                updateList();
                if (game.isLower()){
                    $('#subtitle').text('Guess higher');
                }
                else {
                    $('#subtitle').text('Guess lower');
                }
                $('#players-input').focus();
            }
        } catch (err){
            $('#title').text('Invalid guess');
            $('#players-input').focus();
        }
    }
    function updateList(){
        $('#guess-list li:nth-child(' + game.pastGuesses.length + ')').text(game.playersGuess)
    }
});

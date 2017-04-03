// // global varibale for the score calculation ..
// var winCount = 0;
// var playerLevel = 1;
// var playerLifes = 5;
// var isPused = false;
////////////** enemy class ** ////////////
// Enemies our player must avoid
var Enemy = function(x,y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.height = 40;
    this.width = 50;
    this.speed = 100;
};

// Update the enemy's position, required method for game Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter which will ensure the game runs at the
    // same speed for all computers.
    if ( this.x <= ctx.canvas.width)// the enemy with in the canvas
        this.x += this.speed * dt;
    else
        this.x = - Math.floor(Math.random() * ctx.canvas.width + 10);

    if (player.x < this.x + this.width && player.x + player.width > this.x
        &&player.y < this.y + this.height && player.height + player.y > this.y)
    {
        player.x = 200;
        player.y = 400;
        round.scoreCalculation(-500);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


////////////** Player class ** ////////////
var Player = function(x,y) {
    this.sprite = 'images/char-princess-girl.png';
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 40;
};

Player.prototype.update = function(x,y) {
    //prevent player to move out side the canas
    if (this.y > 400) {
        y = 400;
    }

    if (this.x > 400) {
        x = 400;
    }

    if (this.x < 0) {
        x = 0;
    }

    // check for collision
    if(player.checkCollisions(allEnemies))
    {
        this.x = 200;
        this.y = 400;
        round.scoreCalculation(-500);
    }
    else
    {
        this.x = x;
        this.y = y;

        // Check for player reaching the top rever *wining senario*
        if (this.y <= 0) {
            this.x = 200;
            this.y = 400;
            round.scoreCalculation(500);
        }
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(moveDirction) {
    switch (moveDirction)
    {
        case 'left':
            this.update(this.x -=  60, this.y);
            break;
        case 'up':
            this.update(this.x, this.y -= 60);
            break;
        case 'right':
            this.update(this.x +=  60, this.y);
            break;
        case 'down':
            this.update(this.x , this.y +=  60);
            break;
    }
};

Player.prototype.checkCollisions = function(enemies){
    var isCollide = false;
    var player =this;
    enemies.forEach(function(bug){
        if (bug.x < player.x + player.width  && bug.x + bug.width  > player.x &&
        bug.y < player.y + player.height && bug.y + bug.height > player.y){
            isCollide = true;
        }
    });
    return isCollide;
};

Player.prototype.levelUp = function(){
    playerLevel++;
};



////** Round Class **////
var Round = function(){
    this.winCount = 0;
    this.playerLevel = 1;
    this.playerLifes = 5;
    this.isPused = false;
    this.font = '15pt arial';
    this.fontColor = 'white';
};

Round.prototype.render = function(){
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0,560, 707, 25);

    ctx.font = this.font;
    ctx.fillStyle = this.fontColor;
    ctx.fillText('Level: '+ this.playerLevel, 10, 580);

    ctx.font = this.font;
    ctx.fillStyle = this.fontColor;
    ctx.fillText('Scores: ' +this.winCount, 210, 580);

    //ctx.drawImage(Resources.get('images/stat-heart.png'), 430, 62);
    ctx.font = this.font;
    ctx.fontStyle = this.fontColor;
    ctx.fillText('Lifes: '+ this.playerLifes, 430, 580);
};

Round.prototype.scoreCalculation = function (roundScore)
{
    if (roundScore < 1)
        this.gameOver();
    else
        round.winCount += roundScore;
    if(round.winCount / round.playerLevel === 1000)
    {
        round.playerLevel++;
        allEnemies.forEach(function(enemy) {
            enemy.speed *= (round.playerLevel / 2);
        });
    }
}
Round.prototype.gameOver = function (){
    if(round.playerLifes === 0){
        round.isPused = true;
        alert("GAME OVER !!!.. Try again??");
        gameReset();
    }
    else
        round.playerLifes--;
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var enemyPosition = [60, 140, 220];
var player = new Player(200, 400);
var round = new Round();
creatEnemies();

function creatEnemies()
{
var enemy;
enemyPosition.forEach(function(posY) {
    enemy = new Enemy(100 + Math.floor(Math.random() * 512), posY);
    allEnemies.push(enemy);
});
}



function gameReset (){
        round = new Round();
        player = new Player(200,400);
        allEnemies =[];
        creatEnemies();
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if(!round.isPused)
        player.handleInput(allowedKeys[e.keyCode]);
});

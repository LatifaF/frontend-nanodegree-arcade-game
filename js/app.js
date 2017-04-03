// global varibale for the score calculation ..
var winCount = 0;
var lossCount = 0;
var playerLevel = 1;
var playerLifes = 5;
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
    else {
    this.x = - Math.floor(Math.random() * ctx.canvas.width);
    }
    if (player.x < this.x + this.width && player.x + player.width > this.x
        &&player.y < this.y + this.height && player.height + player.y > this.y) {
        player.x = 200;
        player.y = 400;
        lossCount++;
        playerLifes--;
        $("#score").text(winCount - lossCount);

    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
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
        lossCount++;
        playerLifes--;
        this.x = 200;
        this.y = 400;
        $("#score").text(winCount - lossCount);

    }
    else
    {
        this.x = x;
        this.y = y;

        // Check for player reaching the top rever
        if (this.y <= 0) {
            this.x = 200;
            this.y = 400;
            winCount++;
            $("#score").text(winCount - lossCount);

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
        bug.y < player.y + player.height && bug.y + bug.height > player.y)
            isCollide = true;
    });
    return isCollide;
};

Player.prototype.levelUp = function(){
    playerLevel++;

};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var enemyPosition = [60, 140, 220];
var player = new Player(200, 400);
var enemy;

enemyPosition.forEach(function(posY) {
    enemy = new Enemy(100 + Math.floor(Math.random() * 512), posY);
    allEnemies.push(enemy);
});

// $("#again").click(function() {
//                 // Hide the game over screen
//         $("#gameOver").hide();
//     });

// function gameReset (){
//         playerLevel = 1;
//         player
//         enemies.reset();
//         gem.reset();
//         stats.reset();
//         player.updateLives('add', 2);
//         enemies.spawn(2);
//         gameOver.play();
//         gameMusic.fade(1.0, 0.3, 1000);
//         paused = true;
//         $("#gameOver").show();
// }
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

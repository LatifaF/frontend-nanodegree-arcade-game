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
    this.height = 60;
    this.width = 60;
    this.speed = 100;
};

// Update the enemy's position, required method for game Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter which will ensure the game runs at the
    // same speed for all computers.
    if ( this.x <= ctx.canvas.width)// the enemy with in the canvas
        this.x += this.speed * dt;
    else // to re locate the enemy at the start of the canvas
        this.x = - getRandowmNumber(10,ctx.canvas.width);
    // check if enemy eat the player while it is not moving
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
    this.width = 50;
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

    // check if player collect any items
    player.checkIsCollactable();

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
            creatCollectable();
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

// check if there is colliction bettwen the player and the enemys
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

// check if the player collect any collectable items
Player.prototype.checkIsCollactable = function(){
    var player =this;
        if(collectableHeart != null)
            if (collectableHeart.x < player.x + player.width &&
                collectableHeart.x + collectableHeart.width > player.x &&
                collectableHeart.y < player.y + player.height &&
                collectableHeart.y + collectableHeart.height > player.y){
                round.playerLifes++;
                collectableHeart = null;
            }

    collectableGems.forEach(function(gem){
        if (gem.x < player.x + player.width &&
            gem.x + gem.width > player.x &&
            gem.y < player.y + player.height &&
            gem.y + gem.height > player.y){
            round.scoreCalculation(200);
            // remove the collected item from the array
            collectableGems.splice(collectableGems.indexOf(gem), 1);
        }
    });
};

Player.prototype.levelUp = function(){
    playerLevel++;
};


////** Collectable Class **////
////
var Collectable = function(x, y, sprite, width, height){
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};





////** Round Class **////
/// round class for each rounf that set the level , life and score numbers
var Round = function(){
    this.winCount = 0;
    this.playerLevel = 1;
    this.playerLifes = 5;
    this.isPused = false;
    this.font = '15pt arial';
    this.fontColor = 'white';
};

Round.prototype.render = function(){
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0,560, 707, 25);

    ctx.font = this.font;
    ctx.fillStyle = this.fontColor;
    ctx.fillText('Level: '+ this.playerLevel, 425, 580);

    ctx.font = this.font;
    ctx.fillStyle = this.fontColor;
    ctx.fillText('Scores: ' +this.winCount, 210, 580);

    // loop for drowing lifes hearts .. in the bottom based on the lifes count
    for(var count= 0 ; count < round.playerLifes; count++)
    {
    ctx.drawImage(Resources.get('images/Heart.png'), (4 + (count * 18)), 560 , 20, 25);
    }


    if(collectableHeart !== null)
        ctx.drawImage(Resources.get(collectableHeart.sprite), collectableHeart.x, collectableHeart.y, 60, 100);

    for (var i = 0 ; i < collectableGems.length; i++) {
        ctx.drawImage(Resources.get(collectableGems[i].sprite), collectableGems[i].x, collectableGems[i].y, 60, 100);
    }
};

// calculate score after each try
Round.prototype.scoreCalculation = function (roundScore)
{
    if (roundScore < 1){
        this.gameOver();
        creatCollectable();
    }
    else
        round.winCount += roundScore;
    if(round.winCount / round.playerLevel >= 1000)
    {
        round.playerLevel++;
        // increse the speed when the level gose up
        allEnemies.forEach(function(enemy) {
            enemy.speed *= (round.playerLevel / 2);
        });
    }

}

// calculation of player lifes
Round.prototype.gameOver = function (){
    if(round.playerLifes === 0){
        round.isPused = true;
        alert("GAME OVER !!!.. Try again??");
        gameReset();
    }
    else
        round.playerLifes--;
}

/////////////////////////////
///////// declering varibales
var allEnemies = [];
var enemyPosition = [60, 120, 180, 240];
var player = new Player(200, 400);
var round = new Round();
var collectableGems = [];
var collectableHeart;
creatEnemies();
creatCollectable();

function creatEnemies()
{
var enemy;
enemyPosition.forEach(function(posY) {
    enemy = new Enemy(100 + getRandowmNumber(0,512), posY);
    allEnemies.push(enemy);
});
}

// creat random number of gems and heart ..
// this function called each time the player died or win to refresh the collectable items in the canvas.
function creatCollectable()
{
    var collect;
    var numberOfGem = getRandowmNumber(0,2);
    var gemType = ['images/Gem-Orange.png', 'images/Gem-Green.png', 'images/Gem-Blue.png'];
    collectableGems =[];
    for (var i = 0; i < numberOfGem; i++){
        collect = new Collectable(getRandowmNumber(5,450), getRandowmNumber(80,250), gemType[getRandowmNumber(0,2)],60, 60);
        collectableGems.push(collect);
    }

    if(getRandowmNumber(0,1) > 0 && round.playerLifes < 5)
        collectableHeart = new Collectable(getRandowmNumber(5,450), getRandowmNumber(80,250) ,('images/Heart.png'), 60, 60);
    else
        collectableHeart = null;
}

// function that return random number ..
function getRandowmNumber(min , max)
{
    return Math.floor(Math.random() * (max - min+1) + min) ;
}

// reset the object .. called when the player run out of lifes and what to re start
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

/* eslint-disable */

const Preload = require('./Preload.js');
const Cenario = require('./Cenario.js');

const game = new Phaser.Game(800, 600, Phaser.AUTO, ""); //"gameDiv"
const preload = new Preload();
const cenario = new Cenario();


let player,

    cursors,
    fireButton,

    bullet,
    bullets, //group
    bulletTime = 0,
    
    enemies,
    enemy,

    score = 0,
    scoreText,
    winText;

const mainState = {
    //preloads images and sounds into the game
    preload() {

        preload.preloadAudio(game);
        preload.preloadImages(game);

    },

    //creates cenario for the game(physics, positioning, ...)
    create() {

       cenario.soundTrack = game.add.audio('soundTrack'),
       cenario.spaceField = game.add.tileSprite(0, 0, 800, 600, 'nightField'),
       cenario.backgroundSpeed = 3

        //positioning player on the screen
        player = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'player');
        player.scale.x = 0.1;
        player.scale.y = 0.1;

        //adding physics to the game
        game.physics.enable(player, Phaser.Physics.ARCADE);

        //cursors variable is the arrow-keys now
        cursors = game.input.keyboard.createCursorKeys();

        //the bullets of our spaceShip
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        for (let i = 0; i < 20; i++) {
            let b = bullets.create(0, 0, 'bullet');
            b.name = 'bullet' + i;
            b.exists = false;
            b.visible = false;
            b.checkWorldBounds = true;
            b.events.onOutOfBounds.add(resetBullet, this);
        }

        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;

        createEnemies();

        scoreText =  game.add.text(0, 550, 'Score:', {font: '32px Arial', fill: '#fff'});
        winText = game.add.text(game.world.centerX, game.world.centerY, 'You Win!', {font: '32px Arial', fill: '#fff'});
        winText.visible = false;
    },

    update() {


        game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this);
        //playing soundtrack, loop = true
        cenario.musicBackground();

        //makes cenario moves in vertical loop
        cenario.moveBackground();

        //iddle
        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            player.body.velocity.x = -350;
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = 350;
        }

        //fire
        if (fireButton.isDown) {
            fireBullet();
        }

        scoreText.text = 'Score: ' + score;

        if(score == 4000){
            winText.visible = true;
            scoreText.visible = false;
        }

    }
}

function fireBullet(){
    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(player.x + 27, player.y - 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 150;
        }
    }
}

//called if bullet goes out of the screen
function resetBullet(bullet){
    bullet.kill();
}

function collisionHandler(bullet, enemy){
    bullet.kill();
    enemy.kill();

    score += 100;
}

function createEnemies() {
    for (let y = 0; y < 4; ++y) {
        for (let x = 0; x < 10; ++x) {
            enemy = enemies.create(x * 70, y * 50, 'enemy');
            enemy.anchor.setTo(0.5, 0.5);
        }
    }
    enemies.scale.x = 0.8;
    enemies.scale.y = 0.8;

    enemies.x = 100;
    enemies.y = 50;

    let tween = game.add.tween(enemies).to(
        { x: 200 },
        2000,
        Phaser.Easing.Linear.None,
        true,
        0,
        1000,
        true
    );

    tween.onRepeat.add(descend, this);
}

function descend() {
    enemies.y += 10;
}

game.state.add('mainState', mainState);

game.state.start('mainState');
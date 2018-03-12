/* eslint-disable */
const path = require('path');

//require(path.join(__dirname, './vendor/phaser.min.js'));

const game = new Phaser.Game(800, 600, Phaser.AUTO, ""); //"gameDiv"

let soundTrack,
    spaceField,
    backgroundSpeed,
    player,
    cursors,
    bullets, //group
    bulletTime = 0,
    fireButton,
    enemies,
    enemy;



const mainState = {
    //preloads images and sounds into the game
    preload() {

        game.load.audio('soundTrack', './audio/mars.mp3');
        game.load.image('nightField', './assets/nightSky.png');
        game.load.image('player', './assets/spaceShip.png');
        game.load.image('bullet', './assets/bullet.png'); //16x16
        game.load.image('enemy', './assets/enemy.png');

    },

    //creates cenario for the game(physics, positioning, ...)
    create() {

        //background cenario
        spaceField = game.add.tileSprite(0, 0, 800, 600, 'nightField');

        //speed that the background moves
        backgroundSpeed = 3;

        //adding a soundtrack to the game
        soundTrack = game.add.audio('soundTrack');

        //positioning player on the screen
        player = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'player');
        player.scale.x = 0.1;
        player.scale.y = 0.1;

        //adding physics to the game
        game.physics.enable(player, Phaser.Physics.ARCADE);

        //cursors variable is the arrow-keys now
        cursors = game.input.keyboard.createCursorKeys();

        //the bullets of our spaceShip
        bullets = game.add.weapon(30, 'bullet'); //group, when something needs to be recycled(remember: memory garbage collection)
        bullets.bulletAngleOffset = 90;
        bullets.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        bullets.bulletSpeed = 400;
        bullets.trackSprite(player, 35, 0);
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.enableBody = true;

        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;

        createEnemies();
    },

    update() {

        game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this);

        //playing soundtrack, loop = true
        //soundTrack.play("", 0, 7, true, false);

        //makes cenario moves in vertical loop
        spaceField.tilePosition.y += backgroundSpeed;

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
            bullets.fire();
        }

    }
}

function createEnemies() {
    for (let y = 0; y < 4; ++y) {
        for (let x = 0; x < 10; ++x) {
            enemy = enemies.create(x * 200, y * 200, 'enemy');
            enemy.anchor.setTo(0.5, 0.5);
        }
    }
    enemies.scale.x = 0.15;
    enemies.scale.y = 0.15;

    enemies.x = 100;
    enemies.y = 50;

    let tween = game.add.tween(enemies).to(
        { x: 450 },
        2000,
        Phaser.Easing.Linear.None,
        true,
        0, 
        1000,
        true
    );

    tween.onRepeat.add(descend, this);
}

function descend(){
    enemies.y += 10;
}

function collisionHandler(){
    bullets.kill();
    enemy.kill();
}

game.state.add('mainState', mainState);

game.state.start('mainState');
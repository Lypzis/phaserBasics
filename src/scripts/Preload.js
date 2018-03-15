/* eslint-disable */
class Preload {

    preloadImages(game){
        game.load.image('nightField', './assets/nightSky.png');
        game.load.image('player', './assets/spaceShip.png');
        game.load.image('bullet', './assets/bullet.png'); //16x16
        game.load.image('enemy', './assets/enemy.png');

    }

    preloadAudio(game){
        game.load.audio('soundTrack', './audio/mars.mp3');
    }
};

module.exports = Preload;
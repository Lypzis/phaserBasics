/* eslint-disable */
class Cenario {

    constructor(soundTrack, spaceField, backgroundSpeed){
        this.soundTrack = soundTrack;
        this.spaceField = spaceField;
        this.backgroundSpeed = backgroundSpeed;
    }

    moveBackground(){
        this.spaceField.tilePosition.y += this.backgroundSpeed;
    }

    musicBackground(){
        this.soundTrack.play("", 0, 5, true, false);
    }

}

module.exports = Cenario;
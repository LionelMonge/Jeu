

var groups = [];

var wrapGroup;

var bgMusic, bgMusic2;
var sounds;
var crtSound;

var deltaTimer = 0;
var menuState = {
    preload : function () {

        game.load.spritesheet('matrixfont', 'assets/pics/matrix.png', 38, 40, 94);
        game.load.audio('bgloop1', 'assets/bgmusic.ogg');
        game.load.audio('bgloop2', 'assets/bgmusic2.ogg');

    },
    create : function(){
        bgMusic = game.add.audio('bgloop1');
        bgMusic2 = game.add.audio('bgloop2');
        sounds = [bgMusic, bgMusic2];
        game.sound.setDecodedCallback(sounds, start, this);

        var nameLabel = game.add.text(game.world.centerX, game.world.height - 100, "Click to start !", {
            font: "25px Arial",
            fill: "#00ff00",
            align: "center"
        });
        var nameLabel2 = game.add.text(game.world.centerX, game.world.height - 50, "Music by Doctor Vax", {
            font: "18px Arial",
            fill: "#ffffff",
            align: "center"
        });

        nameLabel.anchor.setTo(0.5, 0.0);
        nameLabel2.anchor.setTo(0.5, 0.0);
        nameLabel.inputEnabled = true;
        nameLabel.events.onInputDown.add(function(){
            game.state.start("play");
            deltaTimer = game.time.totalElapsedSeconds();
        }, this);
/*
 B = [8,1]
 U = [2,7]
 G = [4,11]
 S = [8,4]
 _
 I = [3,7](26)
 N = [5,2]
 _
 T = [5,5]
 H = [5,8]
 E = [4,3]
 _
 M = [2,10]
 A = [3,4]
 T = [5,5]
 R = [7,5]
 I = [3,7]
 X = [7,11]
 */

        wrapGroup = game.add.group();
        generateBar(1,8,1);
        generateBar(2,2,7);
        generateBar(3,4,10);
        generateBar(4,8,4);
        generateBar(5,3,7);
        generateBar(6,5,2);
        generateBar(7,5,5);
        generateBar(8,5,8);
        generateBar(9,4,3);
        generateBar(10,2,9);
        generateBar(11,3,4);
        generateBar(12,5,5);
        generateBar(13,7,5);
        generateBar(14,3,7);
        generateBar(15,7,11);


        wrapGroup.x = (game.world.x/2 + wrapGroup.width/4);
        wrapGroup.y = 100;

    }
}

function generateBar(index, desiredCharI,desiredCharJ){
    var desiredKey = (desiredCharI - 1) * 9 + desiredCharJ -1;

    for(var i=0;i<15; i++){
        groups[i] = game.add.group(wrapGroup);
        for(var j=0; j<10; j++){
            if(j!=5) {
                var rnd = desiredKey;
                while (rnd == desiredKey) {
                    rnd = game.rnd.between(1, 80);
                }
                var tmpsprite = groups[i].create(1 + index * 33, j*33, 'matrixfont', rnd);
                if(j==0){
                    tmpsprite.tint = '0x003300';
                } else if (j == 1){
                    tmpsprite.tint = '0x005500';
                } else if( j == 9){
                    tmpsprite.tint = '0xffffff';
                } else {
                    tmpsprite.tint = '0x008800';
                }
            } else {
                var tmpsprite = groups[i].create(1 + index * 33, j*33, 'matrixfont', desiredKey);
                tmpsprite.tint = '0xff0000';
            }
        }
    }
    //game.add.sprite(10,10,'matrixfont',((desiredCharI -1)* 9 + desiredCharJ -1));
    //game.add.sprite(10,10,'matrixfont',0);
}

function start(){
    console.log('start called');
    bgMusic.loopFull();
    bgMusic.onLoop.add(hasLooped, this);

    crtSound = bgMusic;
}

function hasLooped(){
    crtSound.stop();
    crtSound = game.rnd.pick(sounds);
    crtSound.loopFull();
}


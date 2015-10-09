var MAX_LENGTH = 8;
var MIN_LENGTH = 4;
var NB_BARS = 20;

var TOTAL_SCORE = 0;
var GOAL_SCORE = 50;

var MAX_SIMULT_BUGS = 3;
var crtAliveBugs = 0;

var timerText;
var COUNTDOWN = 60;
var totalBugsOnScreen = 0;
var gameOver = false;

//var
function Bar(column) {
    this.length = 0;
    this.speed = 0;
    this.group = undefined;
    this.column = column;
    //this.canBeBugged = false;
    this.buggedStep = -1;

    this.startDelay = 0;
    this.isBugged = false;
    //itnernal
    this.timer = 0;
    this.steps = 0;
    this.generate = function () {
        this.timer = 0;
        this.steps = 0;
        this.buggedStep = -1;
        this.isBugged = false;
        this.startDelay = game.rnd.between(60, 180);
        var canBeBugged = (game.rnd.between(0, 2) == 0 ? false : true);
        if (canBeBugged == true && crtAliveBugs < MAX_SIMULT_BUGS && totalBugsOnScreen <= 15) {
            this.buggedStep = game.rnd.between(5, 10);
            crtAliveBugs++
            totalBugsOnScreen++;
        }
        this.speed = game.rnd.between(5, 20);
        this.length = game.rnd.between(MIN_LENGTH, MAX_LENGTH);
        if (typeof this.group !== "undefined") {
            this.group.destroy(true, true);// = undefined;
        } else {
            this.group = game.add.group();
        }


        for (var i = 0; i < this.length; i++) {
            var tmpsprite = this.group.create(1, i * 33, 'matrixfont', game.rnd.between(1, 80));
            tmpsprite.inputEnabled = true;
            tmpsprite.events.onInputDown.add(this.removeBar, this);
        }
        this.group.setAllChildren('tint', '0x008800');
        this.group.getChildAt(this.length - 1).tint = '0xFFFFFF';
        this.group.getChildAt(0).tint = "0X003300";
        this.group.getChildAt(1).tint = "0X006600";
        this.group.y = -this.group.height;
        this.group.x = 10 + (this.column * 38);

    }

    this.removeBar = function () {
        console.log(totalBugsOnScreen);

        if (this.buggedStep != -1) {
            //decrement crtTotalBugs
            if (crtAliveBugs > 0) {
                crtAliveBugs--;

            }
            if (totalBugsOnScreen >= 0) {
                totalBugsOnScreen--;

            }

            //bug the previous bar
            if (this.column > 1) {
                if (barre[this.column - 1].startDelay <= 0) {
                    barre[this.column - 1].buggedStep = barre[this.column - 1].steps;
                    totalBugsOnScreen++;
                }
            }

            //bug the next bar
            if (this.column < NB_BARS - 1) {
                if (barre[this.column + 1].startDelay <= 0) {
                    barre[this.column + 1].buggedStep = barre[this.column + 1].steps;
                    totalBugsOnScreen++;
                }
            }
        }
        this.generate();
    }
    this.redify = function () {
        this.group.setAllChildren('tint', '0xff0000');
        this.group.getChildAt(this.length - 1).tint = '0xFFFFFF';
        this.group.getChildAt(0).tint = "0X330000";
        this.group.getChildAt(1).tint = "0X660000";
        //            var tweenA = game.add.tween(this.group.scale).to({x: 1.5,y:1.5}, 200, Phaser.Easing.Linear.None);
        //            var tweenB = game.add.tween(this.group.scale).to({x:1, y:1}, 200, Phaser.Easing.Linear.None);
        //tweenA.chain(tweenB);
        //tweenA.start();


    }
    this.checkUpdate = function () {
        this.startDelay--;
        if (this.startDelay > 0)
            return;
        if (this.timer == this.speed) {
            this.group.y += 30;
            this.steps++;
            this.timer = 0;
        } else {
            this.timer++;
        }

        if (this.buggedStep != -1 && this.isBugged === false) {
            if (this.steps == this.buggedStep) {
                this.isBugged = true;
                this.redify();
                //console.log("red - "+this.column);
            }


        }
        if (this.group.y >= 600 - this.group.height) {
            //reset vars
            if (!this.isBugged) {
                TOTAL_SCORE++;
            } else if (TOTAL_SCORE>0) {
                TOTAL_SCORE--;
            }
            //this.generate();
            this.removeBar();
        }
    }
}
var timer = 0;
var text_score;


var barre = [];
var v_barre = [];
var t_barre = [];
var gameState = {
    //preload : function () {

    //    game.load.spritesheet('matrixfont', 'assets/pics/matrix.png', 38, 40, 93);

    //},

    create : function () {
        game.time.advancedTiming = true;
        game.time.desiredFps = 60;
        game.time.fpsMax = 60;
        game.time.fpsMin = 40;


        text_score = game.add.text(750, 10, TOTAL_SCORE + " / " + GOAL_SCORE, {
            font: "25px Arial",
            fill: "#ffffff",
            align: "center"
        });

        text_score.anchor.setTo(0.5, 0.0);

        timerText = game.add.text(20, 10, "TIME LEFT:" + COUNTDOWN, {
            font: "25px Arial",
            fill: "#ffffff",
            align: "center"
        });

        timerText.anchor.setTo(0, 0);

        for (var i = 0; i < NB_BARS; i++) {
            barre[i] = new Bar(i);
            barre[i].generate();
        }
    },

    update : function () {
        if(gameOver==true) return;

        if (Math.floor(COUNTDOWN - game.time.totalElapsedSeconds() + deltaTimer) > -1) {
            if (TOTAL_SCORE != GOAL_SCORE) {
                for (var i = 0; i < barre.length; i++) {
                    barre[i].checkUpdate();
                }

                text_score.setText(TOTAL_SCORE + " / " + GOAL_SCORE);
                timerText.setText("TIME LEFT: " + Math.floor(COUNTDOWN - game.time.totalElapsedSeconds() + deltaTimer));
                game.world.bringToTop(timerText);
                game.world.bringToTop(text_score);
            } else {
                gameOver = true;
                var wintext = game.add.text(game.world.centerX, game.world.centerY, "YOU WON!", {
                    font: "65px Arial",
                    fill: "#ff0000",
                    align: "center"
                });
                var gameovertext2 = game.add.text(game.world.centerX, game.world.centerY+50, "Refresh to restart (fucking coders who dont finish the game !)", {
                    font: "20px Arial",
                    fill: "#ffffff",
                    align: "center"
                });

                wintext.anchor.setTo(0.5, 0.5);
                gameovertext2.anchor.setTo(0.5, 0.5);
                destroyAll();
            }

        } else {
            gameOver = true;
            var gameovertext = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER!", {
                font: "65px Arial",
                fill: "#ff0000",
                align: "center"
            });
            var gameovertext2 = game.add.text(game.world.centerX, game.world.centerY+50, "Refresh to restart (fucking coders who dont finish the game !)", {
                font: "20px Arial",
                fill: "#ffffff",
                align: "center"
            });

            gameovertext.anchor.setTo(0.5, 0.5);
            gameovertext2.anchor.setTo(0.5, 0.5);
            destroyAll();
        }
    }
    }
function destroyAll() {
    for (var i = 0; i < NB_BARS; i++) {
        barre[i].group.destroy(true);
    }
}
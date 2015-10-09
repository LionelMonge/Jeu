var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamediv');

game.state.add('menu', menuState);
game.state.add('play', gameState);

game.state.start('menu');
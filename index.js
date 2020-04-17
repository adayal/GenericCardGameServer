'use strict';

/**
 * Start the server
 * Ask first player to create a `room`
 * Wait for others to join using webrtc
 * Once everyone joins, select a game
 * Deal the cards and load the rules of the game
 * Play the game
 * 
 */

const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');


const Constants = require('./src/shared/constants');
const Game = require('./src/Game.js');
const webpackConfig = require('./webpack.dev.js');

// Setup an Express server
const app = express();
app.use(express.static('public'));
app.get('/', function(req, res) {
    res.send("hello world");
});

if (process.env.NODE_ENV === 'development') {
    // Setup Webpack for development
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler));
} else {
    // Static serve the dist/ folder in production
    app.use(express.static('dist'));
}

const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);

const game = new Game()

// Listen for socket.io connections
io.on('connection', socket => {
    console.log('Player connected!', socket.id);
    
    /*
    Messages that can be received:
        - JOIN --> player joins the game based on ip
        - DISCONNECT --> remove player from game
        - PLAY_CARD ({actionName, player, card, dest}) --> give card from soemone to someone (or discard)
        - START(game_selected) --> start game once all players are ready
    */

    socket.on(Constants.MSG_TYPES.JOIN_GAME, (data) => {
        game.addPlayer(socket, data);
    });
    socket.on(Constants.MSG_TYPES.DISCONNECT,(id) => {
        game.removePlayer(this);
    });
    socket.on(Constants.MSG_TYPES.PLAY_CARD, (id, msg) => {
        /**
         * @param {playerName, {card}, destination} playedObj 
         */
        game.doAction(this, socket, id, msg);
    });
    socket.on(Constants.MSG_TYPES.START_GAME, (msg) => {
        if (msg && msg.game && Constants.GAMES_LOADED.includes(msg.game)) {
            if (game.loadGames(socket, msg.game)) {
                console.log("successfully started game: " + msg.game);
                socket.emit(Constants.CLIENT_MSG.ACKNOWLEDGED);
            } else {
                socket.emit(Constants.CLIENT_MSG.GENERIC_ERROR);
            }
        } else {
            socket.emit(Constants.CLIENT_MSG.GENERIC_ERROR);
        }
    });
});
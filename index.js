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
const RoomManagement = require('./src/RoomManagement.js')

const Constants = require('./src/shared/constants');

const webpackConfig = require('./webpack.dev.js');

// Setup an Express server
const app = express();
app.use(express.static('public'));

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


//global
const roomManagement = new RoomManagement();

/*
Messages that can be received:
    - JOIN --> player joins the game based on ip
    - DISCONNECT --> remove player from game
    - PLAY_CARD ({actionName, player, card, dest}) --> give card from soemone to someone (or discard)
    - START(game_selected) --> start game once all players are ready
*/
io.on('connection', socket => {
    socket.on(Constants.MSG_TYPES.GET_ROOMS, () => {
        roomManagement.getRoomNames(socket);
    });
    socket.on(Constants.MSG_TYPES.JOIN_GAME, (data) => {
        roomManagement.joinRoom(socket, data);
    });

    socket.on(Constants.MSG_TYPES.DISCONNECT, () => {
        //game.removePlayer(socket);
    });
    
    socket.on(Constants.MSG_TYPES.CREATE_ROOM, (data) => {
        roomManagement.createRoom(socket, data);
    })
    socket.on(Constants.MSG_TYPES.DO_ACTION, (msg) => {
        roomManagement.handleAction(socket, msg);
    });
    socket.on(Constants.MSG_TYPES.SEND_CHAT_MSG, (msg) => {
        roomManagement.handleChatMessage(socket, msg);
    });
    socket.on(Constants.MSG_TYPES.START_GAME, (msg) => {
        roomManagement.handleAction(socket, msg, Constants.MSG_TYPES.START_GAME);
    });
});
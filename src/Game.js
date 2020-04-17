'use strict'

const Player = require("./Player");
const GameLoader = require("./rule_book/GameLoader");
const Constants = require('./shared/constants');

class Game {
    constructor() {
        this.sockets = {};
        this.players = [];
        this.loadedGames = {};
        this.GameLoader = new GameLoader();
        Constants.GAMES_LOADED.forEach(gameName => {
            this.loadedGames["" + gameName] = this.GameLoader.loadGame(gameName)
        });
    }

    loadGames(socketWhoStarted, gameSelected) {
        if (!this.gameSelected && this.loadedGames[gameSelected].canLoadGame(this)) {
            this.loadedGames[gameSelected].startGame(this, socketWhoStarted);
            this.gameSelected = this.loadedGames[gameSelected];
            this.gameSelected.setFirstPlayer(socketWhoStarted.id);
            return true;
        }
        return false;
    }

    doAction(game, socket, socketid, action) {
        if (this.gameSelected) {
            this.gameSelected.handle(this, socket, socketid, action);
        } else {
            socket.emit(Constants.CLIENT_MSG.ERROR_GAME_NOT_LOADED);
        }
    }

    addPlayer(socket, playerName) {
        //prevent duplicate sockets and check if the game is already running
        if (this.gameSelected) {
            socket.emit(Constants.CLIENT_MSG.GAME_ALREADY_STARTED);
        }
        else if (!this.sockets[socket.id]) {
            let id = socket.id;
            this.sockets[id] = socket;
            this.players.push(new Player(playerName, id));
            socket.emit(Constants.CLIENT_MSG.ACKNOWLEDGED);
        } else {
            socket.emit(Constants.CLIENT_MSG.ALREADY_PLAYER);
        }
    }

    removePlayer(socket) {
        if (!this.gameSelected) {
            if (!this.sockets[socket.id]) {
                socket.emit(Constants.CLIENT_MSG.NOT_A_PLAYER);
                console.log("error: socket not in game");
                return;
            }
            delete this.sockets[socket.id];
            delete this.players[socket.id];
            socket.emit(Constants.CLIENT_MSG.ACKNOWLEDGED);
            console.log("player removed successfully");
        } else {
            //game already started
            if (this.gateSelected.removePlayer(this.players[socket.id])) {
                console.log("game still continuing without player");
            } else {
                //destroy game
                this.gameSelected = null;
                kickOtherPlayers(socket);
                this.sockets = {};
                this.players = {};
                console.log("game reset");
            }
        }
    }

    kickOtherPlayers(disconnectedSocket) {
        this.sockets.forEach(socket => {
            if (socket.id != disconnectedSocket.id) {
                socket.emit(Constants.KICK_GAME_TERMINATE)
            }
        })
    }

    doSpecialAction(game, socket, payload) {

    }

    getPlayers() {
        return this.players;
    }

    getSockets() {
        return this.sockets;
    }
}

module.exports = Game;
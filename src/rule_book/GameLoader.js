'use strict'

const SaathAath = require("./Saath_Aath"); 

/**
 * Register new games by extending this abstract class
 * The methods listed below must be implmented in the child class
 */
class GameLoader {

    /**
     * Init the game rulebook here
     * @param {string} gameName Selected game name to play 
     */
    constructor(gameName) {
        if (gameName == SaathAath) {
            this.selectedGame = new SaathAath();
        }
    }

    setFirstPlayer(socketId) {
        this.firstPlayer = socketId;
    }

    //Payload: {actionName, player, card, dest}
    handle(game, socket, socketId, payload) {
        if (!this.selectedGame) {
            socket.emit(Constants.CLIENT_MSG.ERROR_GAME_NOT_LOADED);
            return;
        }
        if (payload.actionName == Constants.CLIENT_MSG.PLAY_CARD) {
            this.selectedGame.playCard(game, socket, socketId, payload);
            socket.emit(Constants.CLIENT_MSG.ACKNOWLEDGED);
            return;
        }

        this.selectedGame.doSpecialAction(game, socket, socketId, payload);    
    }
}

module.exports = GameLoader;
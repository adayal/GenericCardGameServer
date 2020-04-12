import { SaathAath } from './Saath_Aath'
import { Deck } from '../Deck';
/*
import more games here that match rule book interface
*/

class RuleBookAbstract {
    constructor(gameName) {
        if (gameName == SaathAath) {
            this.selectedGame = new SaathAath();
            this.deck = new Deck();
        }
    }

    setFirstPlayer(socketId) {
        this.firstPlayer = socketId;
    }

    //Payload: {actionName, player, card, dest}
    handle(game, socket, payload) {
        if (!this.selectedGame) {
            socket.emit(Constants.CLIENT_MSG.ERROR_GAME_NOT_LOADED);
            return;
        }
        if (payload.actionName == Constants.CLIENT_MSG.PLAY_CARD) {
            this.selectedGame.playCard(game, socket, payload);
        }
        socket.emit(Constants.CLIENT_MSG.ACKNOWLEDGED);
    }

    playCard(game, socket, payload) {
        socket.emit(Constants.CLIENT_MSG.ERROR_GAME_NOT_LOADED);
        console.log("FATAL ERROR, GAME NOT LOADED "+ payload);
        throw new Error('Method not implemented');
    }

    requestCard(game, socket, payload) {
        socket.emit(Constants.CLIENT_MSG.ERROR_GAME_NOT_LOADED);
        console.log("FATAL ERROR, GAME NOT LOADED "+ payload);
        throw new Error('Method not implemented');
    }

    canLoadGame(game, socket) {
        socket.emit(Constants.CLIENT_MSG.ERROR_GAME_NOT_LOADED);
        console.log("FATAL ERROR, CANNOT LOAD GAME ");
        throw new Error('Method not implemented');
    }

    evaluateRules(game, socket) {
        socket.emit(Constants.CLIENT_MSG.ERROR_GAME_NOT_LOADED);
        console.log("FATAL ERROR, CANNOT LOAD GAME ");
        throw new Error('Method not implemented');
    }

    restartGame(game) {
        socket.emit(Constants.CLIENT_MSG.ERROR_GAME_NOT_LOADED);
        console.log("FATAL ERROR, CANNOT LOAD GAME ");
        throw new Error('Method not implemented');
    }
}

export { RuleBookAbstract };
import { SaathAath } from './Saath_Aath'
import { Deck } from '../Deck';

/**
 * Register new games by extending this abstract class
 * The methods listed below must be implmented in the child class
 */
class RuleBookAbstract {

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

        this.selectedGame.doSpecialAction(game, socket, payload);    
    }

    playCard(game, socket, socketId, payload) {
        socket.emit(Constants.CLIENT_MSG.ERROR_GAME_NOT_LOADED);
        console.log("FATAL ERROR, GAME NOT LOADED "+ payload);
        throw new Error('Method not implemented');
    }

    doSpecialAction(game, socket, payload) {
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

    dealCardsToPlayers(player, numberOfCards, isCardVisible, isCardDown) {
        socket.emit(Constants.CLIENT_MSG.ERROR_GAME_NOT_LOADED);
        console.log("FATAL ERROR, CANNOT LOAD GAME ");
        throw new Error('Method not implemented');
    }

    startGame() {
        socket.emit(Constants.CLIENT_MSG.ERROR_GAME_NOT_LOADED);
        console.log("FATAL ERROR, CANNOT LOAD GAME ");
        throw new Error('Method not implemented');
    }

    endGame() {
        socket.emit(Constants.CLIENT_MSG.ERROR_GAME_NOT_LOADED);
        console.log("FATAL ERROR, CANNOT LOAD GAME ");
        throw new Error('Method not implemented');
    }
}

export { RuleBookAbstract };
class RuleBookAbstract {
    
    constructor() {
        //empty constructor
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


module.exports = RuleBookAbstract;
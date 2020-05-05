'use strict'

class Player {
    constructor(playerName, socket) {
        this.playerName = playerName;
        this.hand = [];
        this.playerId = socket.id;
        this.points = 0;
        this.pointsNeeded = 0;
        this.socket = socket;
    }

    getPointsNeeded() {
        return this.pointsNeeded;
    }

    setPointsNeeded(pointsNeeded) {
        this.pointsNeeded = pointsNeeded;
    }

    getPoints() {
        return this.points;
    }

    setPoints(points) {
        this.points = points;
    }

    getPlayerName() {
        return this.playerName;
    }

    getPlayerId() {
        return this.playerId;
    }

    getHand() {
        return this.hand;
    }

    giveCard(cardToGive) {
        this.hand.push(cardToGive);
    }

    giveMultipleCards(cardsToGive) {
        this.hand = this.hand.concat(cardsToGive);
    }

    playCard(cardToPlay) {
        for (let i = 0; i < this.hand.length; i++) {
            if (this.hand[i] == cardToPlay) {
                this.hand.splice(i, 1)
            }
        }
        return null;
    }

    findCard(cardToFind) {
        this.hand[i].foreach(card => {
            if (card.getCardType() == cardToFind.type && card.getCardValue() == cardToFind.value) {
                return card;
            }
        });
        return null;
    }

    isHandEmpty() {
        return this.hand.length == 0;
    }

    announceToPlayer(socketFromGame, command, message) {
        console.log("current command:  " + command);
        console.log("current message: " + message);
        console.log(socketFromGame);
        if (socketFromGame.id == this.socket.id) {
            socketFromGame.emit(command, message);
        }
        else {
            socketFromGame.to(this.socket.id).emit(command, message);
        }
    }
}

module.exports = Player;

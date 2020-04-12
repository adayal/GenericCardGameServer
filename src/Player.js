'use strict'

class Player {
    constructor(playerName, playerId) {
        this.playerName = playerName;
        this.hand = [];
        this.playerId = playerId;
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

    playCard(cardToPlay) {
        for (let i = 0; i < this.hand.length; i++) {
            if (this.hand[i] == cardToPlay) {
                return cardToPlay = this.hand.splice(i, 1)
            }
        }
        return null;
    }

    isHandEmpty() {
        return this.hand.length == 0;
    }
}


export { Player };
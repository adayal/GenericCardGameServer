'use strict'

const Card = require("./Card");

class Deck {
    constructor() {
        //holds the deck before starting any game
        this.innerDeck = [];
        
        //holds the discarded deck
        this.discardDeck = [];
        
        //holds the playing field
        this.playingField = [];

        //reset the deck
        this.resetDeck()
    }

    get innerDeck() {
        return this.innerDeck;
    }

    get discardDeck() {
        return this.discardDeck;
    }

    playToField(card) {
        this.playingField.push(card);
        return true;
        
        /*
        for (let i = 0; i < this.innerDeck.length; i++) {
            if (this.innerDeck[i] == card) {
                this.innerDeck.splice(card, 1);
                this.playingField.push(card);
                return true;
            }
        }
        return false;
        */
        
    }

    getPlayingField() {
        return this.playingField;
    }

    emptyPlayingField() {
        this.playingField = [];
    }

    //void shuffles the deck
    shuffleDeck() {
        for (let i = this.innerDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.innerDeck[i], this.innerDeck[j]] = [this.innerDeck[j], this.innerDeck[i]];
        }
    }

    resetDeck() {
        for (let i = 1; i <= 13; i++) {
            for (let j = 0; j < 4; j++) {
                this.innerDeck.push(new Card(i, Card.getCardTypeByNumber(j), true, false));
            }
        }
        this.discardCard = [];
    }

    //Discard a card by removing it from the deck and moving it to the discard deck pile
    //return true if successful, false otherwise
    discardCard(cardToDiscard) {
        if (!cardToDiscard)
            return false;
        for (let i = 0; i < this.innerDeck.length; i++) {
            if (this.innerDeck[i] == cardToDiscard) {
                this.discardCard.push(...this.innerDeck.splice(i, 1))
                return true;
            }
        }
        return false;
    }

    giveCardFromTop() {
        if (this.innerDeck.length > 0) {
            let topCard = this.innerDeck.splice(0, 1);
            return topCard;
        }
        return null;
    }

    //{actionName, player, card, dest}
    playToField(payload) {
        
    }

    getCard(payload) {
        if (Card.isValidCard(payload.number, payload.cardType)) {
            let card = this.findCardInDeck(payload.number, payload.cardType)
            card.setVisibility(payload.isVisible);
        }
        return null;
    }

    dealCardsFromTop(numberOfCards) {
        let cardsTaken = []
        for (let i = 0; i < numberOfCards; i++) {
            cardsTaken.push(giveCardFromTop());
        }
        return cardsTaken;
    }

    findCardInDeck(number, cardType) {
        this.innerDeck.foreach(card => {
            if (card.getCardValue() == number && card.getCardType() == cardType) {
                return card;
            }
        });
        return null;
    }

}

module.exports = Deck;
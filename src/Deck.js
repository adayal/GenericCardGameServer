'use strict'

const Card = require("./Card");

class Deck {
    constructor() {
        //holds the deck before starting any game
        this._innerDeck = [];
        
        //holds the discarded deck
        this._discardDeck = [];
        
        //holds the playing field
        this._playingField = [];

        //reset the deck
        this.resetDeck()
    }

    get innerDeck() {
        return this._innerDeck;
    }

    set innerDeck(settableDeck) {
        this._innerDeck = settableDeck;
    }

    get discardDeck() {
        return this._discardDeck;
    }

    set discardCard(settableDeck) {
        this._discardDeck = settableDeck;
    }

    set playingField(settableDeck) {
        this._playingField = settableDeck;
    }

    playToField(card) {
        this._playingField.push(card);
        return true;
    }

    getPlayingField() {
        return this.playingField;
    }

    emptyPlayingField() {
        this.playingField = [];
    }

    //void shuffles the deck
    shuffleDeck() {
        for (let i = this._innerDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this._innerDeck[i], this._innerDeck[j]] = [this._innerDeck[j], this._innerDeck[i]];
        }
    }

    resetDeck() {
        for (let i = 1; i <= 13; i++) {
            for (let j = 0; j < 4; j++) {
                this._innerDeck.push(new Card(i, Card.mapCardTypeToCardTypes(j), true, false));
            }
        }
    }

    //Discard a card by removing it from the deck and moving it to the discard deck pile
    //return true if successful, false otherwise
    removeCard(cardToDiscard) {
        if (!cardToDiscard)
            return false;
        this._innerDeck.find((card, index) => {
            if (card && card.getCardValue() == cardToDiscard.getCardValue() && card.getCardType() == cardToDiscard.getCardType()) {
                delete this._innerDeck[index];
                this._discardDeck.push(card)
            }
        });

        //resize the deck
        this.resizeDeck();
        return true;
    }

    resizeDeck() {
        this._innerDeck = this._innerDeck.filter(value => {
            return value !== undefined
        });
    }

    giveCardFromTop() {
        if (this._innerDeck.length > 0) {
            let topCard = this._innerDeck.splice(0, 1);
            this.resizeDeck();
            if (!topCard) {
                console.log(topCard)
                console.log(this._innerDeck);
            }
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
            return card;
        }
        return null;
    }

    dealCardsFromTop(numberOfCards) {
        let cardsTaken = []
        for (let i = 0; i < numberOfCards; i++) {
            cardsTaken.push(this.giveCardFromTop());
        }
        return cardsTaken;
    }

    findCardInDeck(number, cardType) {
        let foundCard = this._innerDeck.find(card => {
            if (card && card.getCardValue() == number && card.getCardType() == Card.mapCardTypeToCardTypes(cardType)) {
                return card;
            }
        });
        return foundCard;
    }
}

module.exports = Deck;
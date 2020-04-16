'use strict'

const Constants = require('./shared/constants');

class Card {
    constructor(number, cardType, isDown, isVisible) {
        this.value = number;
        this.cardType = cardType;

        //isCardDown -> Is the card faced-down?
        this.isCardDown = isDown;

        //isVisible -> can any player see this card?
        this.isVisible = isVisible;
        this.previousOwners = [];
        this.currentOwner = null;
    }

    getCurrentOwner() {
        return this.currentOwner;
    }

    setCurrentOwner(owner) {
        this.previousOwners.push(this.currentOwner);
        this.currentOwner = owner;
    }

    getPreviousOwners() {
        return this.previousOwners;
    }

    setIsCardDown(isDown) {
        this.isCardDown = isDown;
    }

    setVisibility(isVisible) {
        this.isVisible = isVisible;
    }

    getVisibility() {
        return this.isVisible;
    }

    getIsCardDown() {
        return this.isCardDown;
    }

    getCardValue() {
        return this.value;
    }

    getCardType() {
        return this.cardType;
    }

    //get the qualified name of the card using Jack, Queen, King and Ace
    get Name() {
        let name = ""
        switch(this.value) {
            case 11:
                name = "Jack";
                break;
            case 12:
                name = "Queen";
                break;
            case 13:
                name = "King";
                break;
            case 1:
                name = "Ace";
                break;
            default:
                name = number;
        }
        return name + " of " + this.cardType;
    }

    //Compare the value of cards without card type
    static compareCardByValue(cardA, cardB) {
        return cardA.value > cardB.value ? 1 : cardA.value == cardB.value ? 0 : -1;
    }


    static getCardTypeByNumber(number) {
        let cardTypeName = ""
        switch (number) {
            case 0:
                cardTypeName = "Club";
                break;
            case 1:
                cardTypeName = "Diamond";
                break;
            case 2: 
                cardTypeName = "Heart";
                break;
            default:
                cardTypeName = "Spade";
        }
        return cardTypeName;
    }

    static isValidCard(number, cardType) {
        return number < Constants.MAX_CARD_NUMBER && Constants[cardType];
    }
}

Card.POSSIBLE_CARD_TYPES = ["CLUB", "DIAMOND", "HEART", "SPADE"];


module.exports = Card;
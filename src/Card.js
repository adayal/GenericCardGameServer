'use strict'

const Constants = require('../shared/constants');

class Card {
    constructor(number, cardType, isDown) {
        this.value = number;
        this.cardType = cardType;
        this.isCardDown = isDown;
    }

    setIsCardDown(isDown) {
        this.isCardDown = isDown;
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

export { Card };
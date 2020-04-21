'use strict'

const Player = require("../Player");
const RuleBookAbstract = require("./RulebookAbstract");
const Card = require("../Card");
const Deck = require("../Deck");
const Constants = require('../shared/constants');

class SaathAaath extends RuleBookAbstract {
    constructor() {
        super();
        this.gameLoaded = false;
        this.gameInSession = false;
        this.REQUIRED_PLAYERS = 2;
        this.waitingForPlayer = this.firstPlayer;
        this.trumpSuit = "";
        this.deck = null;
        this.totalPoints = 15;
    }

    giveCard(giver, receiver, card) {
        if (giver.playCard(card)) {
            receiver.GiveCard(card);
            return true;
        }
        return false;
    }

    getPlayerByName(name) {
        this.players.foreach(player => {
            if (player.getPlayerName() == name) {
                return player;
            }
        });
    }

    getOpponent(currentPlayer) {
        return this.players[0].getPlayerId() == currentPlayer.getPlayerId() ? this.players[1] : this.players[0];
    }

    playCard(game, socket, payload) {
        
        evaluateRules(game, socket);
        
        //step 1: check how many cards are in the pile
        //step 2: check if the socketPlayer owns the card
        //step 3: add the card to the field pile
        //step 4: remove card from player's possession
        //step 5: evaluate the field

        if (this.deck.getPlayingField().length == this.REQUIRED_PLAYERS) {
            //reject
            return;
        }

        let currentPlayer = this.players[0].getPlayerId == socket.id ? this.player[0] : this.player[1];
        let currentCard = currentPlayer.findCard(payload.card);
        
        if (!currentCard) {
            //card doesn't exist or user doesn't have it
            socket.emit(Constants.CLIENT_MSG.CARD_NOT_FOUND);
            return;
        }

        this.deck.playToField(currentCard);
        
        this.players.forEach(player => {
            if (player.getPlayerId() == socket.id) {
                player.playCard(currentCard);
            }
        });

        evaluateRules(game, socket);
    }

    /*
    * Check Init
    */
    canLoadGame(game) {
        if (this.gameLoaded) {
            return false;
        }

        this.players = game.getPlayers();

        return !this.gameInSession && this.players.length == this.REQUIRED_PLAYERS && this.trumpSuit == "";
    }

    //helper method
    discardInitialCards() {
        for (let i = 2; i <= 6; i++) {
            for (let j = 0; j < 4; j++) {
                this.deck.removeCard(this.deck.getCard({number: i, cardType: j}));
            }
        }
        this.deck.removeCard(this.deck.getCard({number: 7, cardType: 0}));
        this.deck.removeCard(this.deck.getCard({number: 7, cardType: 1}));
    }

    setFirstPlayer(socketId) {
        this.firstPlayer = socketId;
    }



    /*
    * Init Game, Set Deck and players
    */
    startGame(game, socket) {

        this.gameInSession = true;
        this.deck = new Deck();
        this.discardInitialCards();

        this.deck.shuffleDeck();
        //each player gets 15 cards but the card orientation can be different (up or down)
        this.players.forEach(player => {

            //first 5 are faced down and visible (player's hand) 
            //next 5 are not visible and faced down (player's faced down hand)
            //next 5 are visible and faced up (player's faced up hand)
            this.dealCardsToPlayers(player, 5, true, true);
            this.dealCardsToPlayers(player, 5, false, true);
            this.dealCardsToPlayers(player, 5, true, false);
        })
        
        //Set the number of points needed for player 1 to 8
        this.players[0].setPointsNeeded(8);
        //Set the number of points needed for player 2 to 7
        this.players[1].setPointsNeeded(7);

        //send cards to players
        this.players[0].announceToPlayer(socket, Constants.CLIENT_MSG.SEND_CURRENT_HAND, this.players[0].getHand());
        this.players[1].announceToPlayer(socket, Constants.CLIENT_MSG.SEND_CURRENT_HAND, this.players[1].getHand());
        
        //first player to pick trump
        this.players[0].announceToPlayer(socket, Constants.CLIENT_MSG.PICK_TRUMP);
    }

    /**
     * Rules are simple:
     *  Game can only be evaluated when there are 2 cards in the field
     *  When the combined points in the game = 15, the game is over
     *  Cards are evaluated in the following order:
     *  trump && nonTrump --> trump
     *  nonTrump && nonTrump
     *      --> same suite ? higher nonTrump : card of first player
     *  trump && trump --> higher trump
     * @param {*} game 
     * @param {*} socket 
     */
    evaluateRules(game, socket) {
        let totalPoints = this.players.reduce((a,b) => {
            return a.points + b.points;
        }, 0);

            if (this.checkForWin(game, socket, totalPoints)) {
                //houskeeping
                this.restartGame(game);
            } else {
            //no winner yet, keep playing the game
            if (this.deck.getPlayingField() != this.REQUIRED_PLAYERS) {
                return;
            }

            let localField = this.deck.getPlayingField();
            /**
             * Cards are evaluated in the following order:
            *  trump && nonTrump --> trump
            *  nonTrump && nonTrump
            *      --> same suite ? higher nonTrump : card of first player
            *  trump && trump --> higher trump
             * 
             */
            if (Card.getCardTypeByNumber(localField[0].getCardType()).toUpperCase() == this.trumpSuit.toUpperCase() &&
                Card.getCardTypeByNumber(localField[1].getCardType()).toUpperCase() == this.trumpSuit.toUpperCase()) {
                //both are trumps
                if (localField[0].getCardValue() > localField[1].getCardValue()) {
                    //first card is the winner
                    this.players.find(function(elem, index, array) {
                        if (elem.getPlayerId() == localField[0].getCurrentOwner()) {
                            socket.to(elem.getPlayerId).emit(Constants.CLIENT_MSG.LOCAL_WINNER);
                            socket.to(localField[1]).emit(Constants.CLIENT_MSG.LOCAL_LOSER);
                        }
                    });
                } else {
                    //second card is the winner
                    this.players.find(function(elem, index, array) {
                        if (elem.getPlayerId() == localField[1].getCurrentOwner()) {
                            socket.to(elem.getPlayerId).emit(Constants.CLIENT_MSG.LOCAL_WINNER);
                            socket.to(localField[0]).emit(Constants.CLIENT_MSG.LOCAL_LOSER);
                        }
                    });
                }

            } else if (Card.getCardTypeByNumber(localField[0].getCardType()).toUpperCase() == this.trumpSuit.toUpperCase()) {
                //first card is a trump and wins automatically
                this.players.find(function(elem, index, array) {
                    if (elem.getPlayerId() == localField[0].getCurrentOwner()) {
                        socket.to(elem.getPlayerId).emit(Constants.CLIENT_MSG.LOCAL_WINNER);
                        socket.to(localField[1]).emit(Constants.CLIENT_MSG.LOCAL_LOSER);
                    }
                });
                
            } else if (Card.getCardTypeByNumber(localField[1].getCardType()).toUpperCase() == this.trumpSuit.toUpperCase()) {
                //second card is a trump and wins automatically
                this.players.find(function(elem, index, array) {
                    if (elem.getPlayerId() == localField[1].getCurrentOwner()) {
                        socket.to(elem.getPlayerId).emit(Constants.CLIENT_MSG.LOCAL_WINNER);
                        socket.to(localField[0]).emit(Constants.CLIENT_MSG.LOCAL_LOSER);
                    }
                });
            } else {
                //both cards are not trumps
                if (localField[0].getCardType() == localField[1].getCardType()) {
                    if (localField[0].getCardValue() > localField[1].getCardValue()) {
                        //first card is the winner
                        this.players.find(function(elem, index, array) {
                            if (elem.getPlayerId() == localField[0].getCurrentOwner()) {
                                socket.to(elem.getPlayerId).emit(Constants.CLIENT_MSG.LOCAL_WINNER);
                                socket.to(localField[1]).emit(Constants.CLIENT_MSG.LOCAL_LOSER);
                            }
                        });
                    } else {
                        //second card is the winner
                        this.players.find(function(elem, index, array) {
                            if (elem.getPlayerId() == localField[1].getCurrentOwner()) {
                                socket.to(elem.getPlayerId).emit(Constants.CLIENT_MSG.LOCAL_WINNER);
                                socket.to(localField[0]).emit(Constants.CLIENT_MSG.LOCAL_LOSER);
                            }
                        });
                    }
                } else {
                    //first card is the winner
                    this.players.find(function(elem, index, array) {
                        if (elem.getPlayerId() == localField[0].getCurrentOwner()) {
                            socket.to(elem.getPlayerId).emit(Constants.CLIENT_MSG.LOCAL_WINNER);
                            socket.to(localField[1]).emit(Constants.CLIENT_MSG.LOCAL_LOSER);
                        }
                    });
                }
            }

            if (this.checkForWin(game, socket, totalPoints)) {
                //houskeeping
                this.restartGame(game);
            }

            this.deck.emptyPlayingField();
        }
    }

    checkForWin(game, socket, totalPoints) {
        if (totalPoints == this.totalPoints) {
            let player1 = this.players[0];
            let player2 = this.players[1];
            if (player1.getPoints() == player1.getPointsNeeded()) {
                //game ended in draw
                this.announceToAllPlayers(socket, Constants.CLIENT_MSG.NO_WINNER);
            } else if (player1.getPoints() < player1.getPointsNeeded()) {
                //player 1 unable to make quota
                socket.to(player1.getPlayerId()).emit(Constants.CLIENT_MSG.LOSER, player1.getPoints() - player1.getPointsNeeded());
                socket.to(player2.getPlayerId()).emit(Constants.CLIENT_MSG.WINNER, player2.getPoints() - player2.getPointsNeeded());
            } else {
                //player 2 unable to make quota
                socket.to(player1.getPlayerId()).emit(Constants.CLIENT_MSG.WINER, player1.getPoints() - player1.getPointsNeeded());
                socket.to(player2.getPlayerId()).emit(Constants.CLIENT_MSG.LOSER, player2.getPoints() - player2.getPointsNeeded());
            }
        }
    }

    dealCardsToPlayers(player, numberOfCards, isCardVisible, isCardDown) {
        this.players.find((elem) => {
            if (elem.getPlayerId() == player.getPlayerId()) {
                
                //set the owner of the cards
                let cardsFromDeck = this.deck.dealCardsFromTop(numberOfCards).map(card => {
                    card[0].setCurrentOwner(player.getPlayerId());
                    card[0].setVisibility(isCardVisible);
                    card[0].setIsCardDown(isCardDown);
                    return card[0];
                })
                console.log(cardsFromDeck);
                elem.giveMultipleCards(cardsFromDeck);
            }
        })
    }

    /**
     * SPECIAL ALLOWED ACTIONS
     * 
     * @param {*} game 
     * @param {*} socket 
     * @param {*} payload 
     */
    doSpecialAction(game, socket, payload) {
        if (payload.actionName == this.getSpecialActions().SET_TRUMP) {
            let requestedPlayer = null;
            this.players.foreach(player => {
                if (player.getPlayerId() == socket.id) {
                    requestedPlayer = player;
                }
            });
            //the requested player must be the first player
            if (payload.cardSuite != "" && 
                this.trumpSuit == "" && 
                requestedPlayer && 
                requestedPlayer.getPlayerId() == this.firstPlayer) {
                if (Card.POSSIBLE_CARD_TYPES.indexOf(cardSuite.ToUpperCase()) > -1) {
                    this.trumpSuit = payload.cardSuite;
                    this.players[0].announceToPlayer(socket, Constants.CLIENT_MSG.ACKNOWLEDGED);
                    this.players[1].announceToPlayer(socket, Constants.CLIENT_MSG.PICK_TRUMP, payload.cardSuite);
                    this.players[0].announceToPlayer(socket, Constants.CLIENT_MSG.YOUR_TURN);
                    return;
                }
            }

            socket.emit(Constants.CLIENT_MSG.ERROR_ILLEGAL_MOVE);
            return;
        }

        socket.emit(Constants.CLIENT_MSG.ERROR_ILLEGAL_MOVE);
        return;
    }

    restartGame(game) {
        this.deck = new Deck();
        this.players.foreach(player => {
            player = new Player();
        });
    }

    //set special actions here
    getSpecialActions() {
        return {
            SET_TRUMP: "SET_TRUMP"
        }
    }

    announceToAllPlayers(socket, message, payload) {
        this.players.forEach(x => {
            x.announceToPlayer(socket, message, payload);
        });
    }
}

module.exports = SaathAaath
import { RuleBookAbstract } from "./Rulebook";
import { Deck } from "../Deck";
import { Player } from "../Player";
const Constants = require('../shared/constants');

class SaathAaath extends RuleBookAbstract {
    constructor() {
        this.gameLoaded = true;
        this.gameInSession = false;
        this.REQUIRED_PLAYERS = 2;
        this.playingFieldPile = [];
        this.playingField = [];
        this.waitingForPlayer = this.firstPlayer;
        
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
        return this.players[0].getPlayerByName() == currentPlayer.getPlayerName() ? this.players[1] : this.players[0];
    }

    playCard(game, socketPlayer, payload) {
        let cardToPlay = this.deck.getCard(payload.card);
        if (!cardToPlay) {
            //cannot find card that was requested
            socketPlayer.emit(Constants.CLIENT_MSG.CARD_NOT_FOUND);
            return false;
        }
        this.players.foreach(player => {
            let destWasPlayer = false;
            if (player.getPlayerName() == payload.dest) {
                destWasPlayer = true;
                let receiver = this.getPlayerByName(payload.dest);
                if (receiver) {
                    if (this.giveCard(player, receiver, cardToPlay)) {
                        return true;
                    }
                    //emit error
                    return false;
                } else {
                    
                    //cannot find destination
                    return false;
                }
            }
            if (!destWasPlayer) {
                cardToPlay.setIsCardDown(false);
                //playing to field
                //check if this player is the player's who we are waiting for
                //check how many cards are already on the playing field
                
                if (this.deck.playingField.length < this.REQUIRED_PLAYERS) {
                    //if the field has no cards, then the requested player should be the first player
                    if (this.deck.playingField.length == 0 && this.waitingForPlayer == socketPlayer.id) {
                        //do action, right player is playing card
                        this.waitingForPlayer = getOpponent(player).getPlayerId();
                        player.playCard(payload.card);
                        this.deck.playToField(payload);
                    } else if (this.deck.playingField.length == 1 && this.waitingForPlayer == socketPlayer.id) {
                        //do action, right player is playing card
                        this.waitingForPlayer = getOpponent(player).getPlayerId();
                        player.playCard(cardToPlay);
                        this.deck.playToField(payload);
                    } else {
                        //throw error back to player, not waiting for that specific player to play
                    }

                } else {
                    //throw an error back to the player, required players not there
                }
            }

            //regardless of error or not, evaluate the rules to determine if there is a winner
            this.evaluateRules(game, socketPlayer);
        });

        
    }

    /*
    * Init game here
    */
    canLoadGame(game, socket) {
        if (this.gameLoaded) {
            return false;
        }

        this.players = game.getPlayers();

        //game lock
        if (!this.gameInSession && this.players.length == this.REQUIRED_PLAYERS) {
            this.gameInSession = true;
            this.deck = new Deck();
            this.suffleDeck();
            //each player gets 30 cards but the card orientation can be different (up or down)
            this.players.foreach(player => {

            })
            this.dealCardsToPlayers(5);
            /*
            tell 
            */
        }
    }

    evaluateRules(game, socket) {

    }

    restartGame(game) {
        this.deck = new Deck();
        this.players.foreach(player => {
            player = new Player();
        });
    }
}

export { SaathAaath }
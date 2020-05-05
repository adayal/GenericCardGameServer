const io = require('socket.io-client')
const Constants = require('../shared/constants');

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: true, transports: ['websocket'] });
const joinGameButtonElem = document.getElementById("joinGameButton");
const playGamebuttonElem = document.getElementById("playGameButton");
const nameField = document.getElementById("nameField");
const messageFromServer = document.getElementById("messageFromServer");
const cardsInHandElem = document.getElementById("playerCardsInHand");
const playerCardsOnFieldElem = document.getElementById("playerCardsOnField");
const playerCardsFacedDownElem = document.getElementById("playerCardsFacedDown");
const chatContainerElem = document.getElementById("chatContainer");
const sendMessageButtonElem = document.getElementById("sendMessageButton");
const preMessageAreaElem = document.getElementById("preMessageArea");

var playerCardsInHand = [];
var playerCardsOnFieldHidden = [];
var playerCardsOnFieldShown = [];
var gameCardsOnField = [];
var opponentsCardsOnField = [];
var opponentName = "";
var isConnected = false;
var isPlayer = false;

import './css/playingCard.css';


const connectedPromise = new Promise(resolve => {
    socket.on('connect', () => {
      console.log('Connected to server!');
      resolve();
      isConnected = true;
    });
    socket.on('reconnect_attempt', () => {
        console.log("trying to reconnect");
    });
    socket.on('reconnect_error', () => {
        console.log("reconnect errored");
    });
    socket.on('reconnect_failed', () => {
        console.log("reconnect failed");
    });
    socket.on('reconnect', (attemptNumber) => {
        console.log("trying to connected #" + attemptNumber);
    });
    socket.on('disconnect', (reason) => {
        console.log("disconnected because: " + reason);
    });
    socket.on('error', (error) => {
        console.log("disconnected because of error: " + error);
    })
  });

  joinGameButtonElem.onclick = () => {
    registerMessageListeners();
    socket.emit(Constants.MSG_TYPES.JOIN_GAME, nameField.value);
}

playGamebuttonElem.onclick = () => {
    let gameSelect = {
        "game": "SATH_AATH"
    }
    socket.emit(Constants.MSG_TYPES.START_GAME, gameSelect);
}

sendMessageButtonElem.onclick = () => {
    if (isPlayer) {
        let message = {};
        message.playerId = socket.id;
        message.playerMessage = preMessageAreaElem.value;;
        socket.emit(Constants.MSG_TYPES.SEND_CHAT_MSG, message);
        //the game will emit it back to us if it receieves the message
        //addMessageToChat(preMessageAreaElem.value, 0);
        preMessageAreaElem.value = "";
    } else {
        //set error banner
        acknowledgeServerErrorMessage(Constants.CLIENT_MSG.NOT_CONNECTED);
    }
}

function registerMessageListeners() {
    connectedPromise.then(() => {
        socket.on(Constants.CLIENT_MSG.ACKNOWLEDGED, acknowledgeServerMessage);
        socket.on(Constants.CLIENT_MSG.SEND_CURRENT_HAND, loadCurrentHand);
        socket.on(Constants.CLIENT_MSG.RECIEVE_CHAT_MSG, function(msg){
            console.log("hi there");
            console.log(msg);            
        }); 
        socket.on(Constants.CLIENT_MSG.ERROR_GAME_NOT_LOADED, acknowledgeServerErrorMessage);
    });
}

function acknowledgeServerMessage(msg) {
    console.log("message from server: " + msg);
    if (msg && msg.playerName && msg.playerName != nameField.value) {
        //server will announce that opponent has joined
        opponentName = msg.playerName;
        addMessageToChat(msg.playerName, -1);
    } else {
        messageFromServer.innerHTML = "Game Joined!"
        isPlayer = true;
    }
}

function acknowledgeServerErrorMessage(msg) {
    if (msg == Constants.CLIENT_MSG.ERROR_GAME_NOT_LOADED) {
        addMessageToChat("Game has not loaded yet, please try again later", -1);
    } else if (msg == Constants.CLIENT_MSG.NOT_CONNECTED) {
        addMessageToChat("Not connected to game yet, please try again later", -1);
    }
}

function receiveChatMessage(msg) {
    console.log("I received something");
    console.log(msg);
    if (msg.playerId == socket.id) {
        //if the player is self, show the message as "you sent"
        addMessageToChat(msg.playerMessage, 0);
    } else {
        //add as if the other person sent a message
        addMessageToChat(msg.playerMessage, 1);
    }
    
}

function loadCurrentHand(cards) {
    cards.forEach(card => {
        if (card.isCardDown && card.isVisible) {
            //card is down and visible = card in hand
            playerCardsInHand.push(card);
        } else if (card.isCardDown && !card.isVisible) {
            //card is down and not visibile (player's cards hidden on field)
            playerCardsOnFieldHidden.push(1); //we don't care about the card
        } else if (!card.isCardDown && card.isVisible) {
            //card is not down and is visible --> visible to the player and opponent
            playerCardsOnFieldShown.push(card);
        } else {
            console.log("unrecognized card positions " + card.value);
        }
    });
    display();
}

function display() {
    
    //destroy all elements before starting
    while (cardsInHandElem.firstChild) cardsInHandElem.removeChild(cardsInHandElem.lastChild);
    while (playerCardsOnFieldElem.firstChild) playerCardsOnFieldElem.removeChild(playerCardsOnFieldElem.lastChild);
    while (playerCardsFacedDownElem.firstChild) playerCardsFacedDownElem.removeChild(playerCardsFacedDownElem.lastChild);
    
    //construct the cards in UI
    playerCardsInHand.forEach(card => {
        cardsInHandElem.appendChild(constructCard(card));
    });
    playerCardsOnFieldShown.forEach(card => {
        playerCardsOnFieldElem.appendChild(constructCard(card));
    });
    
    playerCardsOnFieldHidden.forEach(discard => {
        playerCardsFacedDownElem.appendChild(constructCard("down"));
    })
}

function numToLetter(num) {
    if (num == 1)
        return "a";
    else if (num <= 10)
        return num;
    else if (num == 11)
        return "j";
    else if (num == 12)
        return "q";
    else
        return "k";
}

function typeToClass(type) {
    if (type.toLowerCase() == "diamond") {
        return "diams";
    }
    return type.toLowerCase() + "s";
}

/**
 * Returns a card that's embedded in a div within a list element
 * @param {*} card 
 */
function constructCard(card) {
    let listHead = document.createElement("li");
    let divElem = document.createElement("div");
    
    if (card == "down") {
        divElem.className = "card back";
    } else {
        let classNameDerivedFromNumber = numToLetter(card.value);
        let classNameDerivedFromCardType = typeToClass(card.cardType.toLowerCase());
        let divClassName = "card rank-" + classNameDerivedFromNumber + " " + classNameDerivedFromCardType;
        divElem.className = divClassName;
        
        let spanChildSubOne = document.createElement("span");
        let spanChildSubTwo = document.createElement("span");
        spanChildSubOne.className = "rank";
        spanChildSubOne.innerHTML = classNameDerivedFromNumber;
    
        spanChildSubTwo.className = "suit";
        spanChildSubTwo.innerHTML = "&" + classNameDerivedFromCardType + ";";
    
        divElem.appendChild(spanChildSubOne);
        divElem.appendChild(spanChildSubTwo);
    }
    listHead.appendChild(divElem);
    return listHead;
}

function constructMessage(message, sender) {
    let messageDivElem = document.createElement("div");
    let playerNameElem = document.createElement("p");
    let messageElem = document.createElement("p");
    //create the time
    let currentDate = new Date();
    let timeElem = document.createElement("span")
    timeElem.className = "time-right";
    timeElem.innerHTML = currentDate.getHours() + ":" + currentDate.getMinutes();

    let classForMessage = "container";
    let playerNameMessage = "";

    //pick the right message class
    if (sender == 0) {
        playerNameMessage = "You said:"
    } else if (sender == -1) {
        classForMessage += " darker";
        playerNameMessage = "Server says:"
    } else {
        classForMessage += " player-color";
        playerNameMessage += opponentName + " says:"
    }

    //create the message
    playerNameElem.innerHTML = playerNameMessage;
    messageDivElem.className = classForMessage;
    messageElem.innerHTML = message;

    //append everything in div
    messageDivElem.appendChild(playerNameElem);
    messageDivElem.appendChild(messageElem);
    messageDivElem.appendChild(timeElem);

    return messageDivElem;
}

function addMessageToChat(message, sender) {
    let constructedMessage = constructMessage(message, sender);
    chatContainerElem.appendChild(constructedMessage);
}
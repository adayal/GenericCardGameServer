const io = require('socket.io-client')
const Constants = require('../shared/constants');

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });
const playGameButton = document.getElementById("joinGameButton");
const nameField = document.getElementById("nameField");
const messageFromServer = document.getElementById("messageFromServer");
const opponentName = document.getElementById("opponentName");

const connectedPromise = new Promise(resolve => {
    socket.on('connect', () => {
      console.log('Connected to server!');
      resolve();
    });
  });

playGameButton.onclick = () => {
    registerMessageListeners();
    socket.emit(Constants.MSG_TYPES.JOIN_GAME, nameField.value);
}

function registerMessageListeners() {
    connectedPromise.then(() => {
        socket.on(Constants.CLIENT_MSG.ACKNOWLEDGED, acknowledgeMessage);
    });
}

function acknowledgeMessage(msg) {
    if (msg.playerName && msg.playerName != nameField.Value) {
        opponentName.innerHTML = msg.playerName;
    }
    messageFromServer.innerHTML = "Game Joined!"
}
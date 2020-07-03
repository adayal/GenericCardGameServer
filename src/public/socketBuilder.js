const io = require('socket.io-client');
const Constants = require('../shared/constants');
import { sendChat, receiveChat, acknowledgeServerMessage, acknowledgeServerErrorMessage } from './chat.js'

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: true, transports: ['websocket'] });
var isConnected = false;

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

export const connect = () => (
    connectedPromise.then(() => {
        socket.on(Constants.CLIENT_MSG.ACKNOWLEDGED, acknowledgeServerMessage);
        //socket.on(Constants.CLIENT_MSG.SEND_CURRENT_HAND, loadCurrentHand);
        socket.on(Constants.CLIENT_MSG.RECIEVE_CHAT_MSG, receiveChat); 
        socket.on(Constants.CLIENT_MSG.ERROR_GAME_NOT_LOADED, acknowledgeServerErrorMessage);
        socket.on(Constants.MSG_TYPES.SEND_ROOMS, )
    })
);

export function getRooms() {
    if (isConnected)
        socket.emit(Constants.MSG_TYPES.GET_ROOMS);
}
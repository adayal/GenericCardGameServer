'use strict';

class Room {
    constructor(roomId, gameInstance, socket, canJoinRoom, password) {
        this.roomId = roomId;
        this.gameInstance = gameInstance;
        this._sockets = [];
        this.addSocket(socket);
        this.canJoinRoom = canJoinRoom;
        this.password = password;
    }

    get roomId() {
        return this._roomId;
    }

    set roomId(roomId) {
        this._roomId = roomId
    }

    get sockets() {
        return this._sockets;
    }

    addSocket(socketToPush) {
        this._sockets.push(socketToPush);
    }

    //support chaining
    get gameInstance() {
        return this._gameInstance;
    }

    set gameInstance(instance) {
        this._gameInstance = instance;
    }

    get canJoinRoom() {
        return this._canJoinRoom;
    }

    set canJoinRoom(state) {
        this._canJoinRoom = state;
    }
    
    get password() {
        return this._password;
    }

    set password(newPass) {
        this._password = newPass;
    }
}

module.exports = Room;
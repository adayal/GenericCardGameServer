'use strict';

const Game = require('./Game.js');
const Constants = require('./shared/constants');

class RoomManagement {
    constructor() {
        //master list of rooms mapped by id to the current game at play
        //structure --> rooms[{roomId: 'abc', gameInstance: gameObj, sockets: [socket1, socket2]}]
        this.rooms = [];
    }

    getRoomNames(socket) {
        let roomsOut = [];
        this.rooms.forEach(room => {
            roomsOut.push(room.roomId);
        });
        socket.emit(Constants.MSG_TYPES.SEND_ROOMS, roomsOut);
    }

    createRoom(socket, data) {
        let roomName = data.roomName;
        if (!this.getRoomByName(roomName)) {
            this.rooms.push({
                'roomId': roomName,
                'gameInstance': new Game(),
                'sockets': [socket]
            });
            socket.room = roomName;
            socket.emit(Constants.MSG_TYPES.ROOM_CREATED);
        } else {
            //throw error that room already exists
            socket.emit(Constants.MSG_TYPES.ROOM_ALREADY_EXISTS);
        }
    }

    joinRoom(socket, data) {
        let requestedRoom = data.requestedRoom;
        let roomToJoin = this.getRoomByName(requestedRoom);
        if (roomToJoin) {
            if (this.hasAlreadyJoinedRoom(roomToJoin, socket)) {
                socket.emit(Constants.MSG_TYPES.ALREADY_JOINED_ROOM);
                return;
            }
            roomToJoin.sockets.push(socket);
            socket.room = roomToJoin.roomId;
            roomToJoin.gameInstance.addPlayer(socket, data);
        } else {
            socket.emit(Constants.MSG_TYPES.ROOM_NOT_CREATED);
        }
    }

    hasAlreadyJoinedRoom(room, socket) {
        let socketListInRoom = room.sockets;
        for (let i = 0; i < socketListInRoom.length; i++) {
            if (socketListInRoom[i].id == socket.id) {
                return true
            }
        }
        return false;
    }

    getRoomByName(roomName) {
        let exists = null;
        this.rooms.forEach(room => {
            if (room.roomId == roomName) {
                exists = room;
            }
        });
        return exists;
    }

    handleAction(socket, msg, specialAction) {
        let roomToSendAction = this.getRoomByName(socket.room);
        if (specialAction == Constants.MSG_TYPES.START_GAME) {
            if (roomToSendAction) {
                if (msg && msg.game && Constants.GAMES_LOADED.includes(msg.game)) {
                    if (roomToSendAction.gameInstance.loadGames(socket, msg.game)) {
                        socket.emit(Constants.CLIENT_MSG.ACKNOWLEDGED);
                    } else {
                        socket.emit(Constants.CLIENT_MSG.GENERIC_ERROR);
                    }
                } else {
                    socket.emit(Constants.CLIENT_MSG.GENERIC_ERROR);
                }
            } else {
                socket.emit(Constants.MSG_TYPES.ROOM_NOT_JOINED);
            }
        } else {
            if (roomToSendAction) {
                roomToSendAction.gameInstance.doAction(socket, msg);
            } else {
                socket.emit(Constants.MSG_TYPES.ROOM_NOT_JOINED);
            }
        }
    }

    handleChatMessage(io, socket, msg) {
        let roomToSendAction = this.getRoomByName(socket.room);
        if (roomToSendAction) {
            //io.sockets["in"](socket.room).emit(Constants.MSG_TYPES.RECIEVE_CHAT_MSG, msg);
            //socket.to(socket.room).emit(Constants.MSG_TYPES.RECIEVE_CHAT_MSG, msg);
            socket.broadcast.to(socket.room).emit(Constants.MSG_TYPES.RECIEVE_CHAT_MSG, msg);
        } else {
            socket.emit(Constants.MSG_TYPES.ROOM_NOT_JOINED);
        }
    }
}

module.exports = RoomManagement;
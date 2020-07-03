import { getRooms } from './socketBuilder';

const availableGamesButton = document.getElementById("gamesAvailableButton");
const availableRoomsButton = document.getElementById("roomsAvailableButton");

if (availableGamesButton) {
    availableGamesButton.onclick = () => {
        window.location.href = './showAvailableGames.html';
    }
}

if (availableRoomsButton) {
    availableRoomsButton.onclick = () => {
        window.location.href = './showAvailableRooms.html';
    }
}
const Game = require('./game-memorice-server');

var PlayerWaitingSocketId = null;
var PlayerRoom = {

};

var RoomsForGame = {

};

module.exports.Memorice = (server) => {

    return (socket) => {
        if(!PlayerWaitingSocketId){
            socket.join(socket.id);
            PlayerWaitingSocketId = socket.id;
            console.log(`Jugador 1 conectado: ${socket.id}. Esperando oponente.`);
        }
        else{

            const roomName = PlayerWaitingSocketId;
            socket.join(roomName);
            console.log(`Jugador 2 conectado: ${socket.id}. Se une a la sala: ${roomName}`);

            RoomsForGame[roomName] = new Game(8, roomName, socket.id);
            RoomsForGame[roomName].shuffleDeck(); 

            PlayerRoom[roomName] = roomName;
            PlayerRoom[socket.id] = roomName;

            const socketIdStarts = (Math.random() * 10) < 5 ? roomName : socket.id;

            server.to(roomName).emit("server:newGame", {
                socketIdStarts: socketIdStarts,
                deck: RoomsForGame[roomName].deck // Es crucial enviar el mazo
            });

            PlayerWaitingSocketId = null;
        }

        socket.on("client:flipCard", (cardIndex) => {
            const roomName = PlayerRoom[socket.id];
            if (!roomName) return;

            const serverCardIndex = RoomsForGame[roomName].deck[cardIndex];
            
            server.to(roomName).emit("server:flipCard", {
                cardIndex,
                serverCardIndex
            });
        });

        socket.on("client:checkMatch", ({ card1, card2 }) => {
            const roomName = PlayerRoom[socket.id];
            if (!roomName) return;

            const currentGame = RoomsForGame[roomName].checkForMatch(socket.id, card1, card2);
            
            server.to(roomName).emit("server:checkMatchServer", currentGame);
        });

        socket.on('disconnect', () => {
            console.log(`Jugador desconectado: ${socket.id}`);
            if (PlayerWaitingSocketId === socket.id) {
                PlayerWaitingSocketId = null;
            }
        });
    };
};
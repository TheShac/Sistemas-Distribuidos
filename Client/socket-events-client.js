const socket = io();

function ioGame(){
    const self = this;

    this.deck = [];

    this.startNewGame = (callBack) => {
        socket.on("server:newGame", data => {
            self.deck = data.deck; 
            
            data.myTurn = data.socketIdStarts === socket.id;
            callBack(data);
        });
    };

    this.flipCard = function(cardIndex) {
        socket.emit("client:flipCard", cardIndex); 
    };

    this.checkMatch = function(card1, card2) {
        socket.emit("client:checkMatch", {card1, card2});
    };

    this.flipCardServer = function(callBack) {
        socket.on("server:flipCard", callBack);
    };

    this.checkMatchServer = function(callBack) {
        const self = this;
        socket.on("server:checkMatchServer", data => {
            data.myTurn = data.player === socket.id ? data.isMatch : !data.isMatch;

            const myStats = data.scores[socket.id];
            
            if(data.gameOver){
                const opponentId = Object.keys(data.scores).find(id => id !== socket.id);
                const opponentStats = data.scores[opponentId];
                
                data.myMatches = myStats.matches.length;
                data.opponentMatches = opponentStats.matches.length;
                
                data.winner = data.myMatches > data.opponentMatches;
                data.isTie = data.myMatches === data.opponentMatches;
                data.myStats = myStats;
            }
            else{
                data.myStats = myStats;
            }
            callBack(data);
        });
    };
}

const socketGame = new ioGame();
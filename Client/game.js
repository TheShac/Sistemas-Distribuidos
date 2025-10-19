const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    win: document.querySelector('.win'),
    turn : document.querySelector('#turn'),
}

const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌']

const state = {
    flippedCards: 0,
    myTurn: false,
    deck: [],
    lockBoard: false,
};


const generateGame = (serverDeck) => { 
    state.deck = serverDeck;

    const dimensions = selectors.board.getAttribute('data-dimension') 

    const cardsHtml = state.deck.map((item, index) => `
        <div class="card" data-index="${index}" data-value="${item}">
            <div class="card-front"></div>
            <div class="card-back"></div>
        </div>
    `).join('')
    
    const boardHtml = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${cardsHtml}
        </div>
    `
    const parser = new DOMParser().parseFromString(boardHtml, 'text/html')

    const newBoard = parser.querySelector('.board');
    selectors.board.replaceWith(newBoard);
    selectors.board = newBoard;
}

const flipBackCards = () => {

    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
        card.querySelector('.card-back').innerHTML = '';
    })

    state.flippedCards = 0
}

const attachEventListeners = () => {
    selectors.board.addEventListener('click', event => {
        const cardElement = event.target.closest('.card');
        
        if (cardElement) {
            if (state.lockBoard || !state.myTurn || cardElement.classList.contains('flipped')) {
                return;
            }
            if (state.flippedCards < 2) {
                const cardIndex = parseInt(cardElement.getAttribute('data-index'));
                socketGame.flipCard(cardIndex);
            }
        }
    })
}

function switchMyTurn(data) {
    state.myTurn = data.myTurn;
    const message = state.myTurn ? 'Es tu turno, escoge dos cartas' : 'Espera tu turno';
    selectors.turn.innerHTML = `<h1>${message}</h1>`;
}

socketGame.startNewGame((data) => {
    selectors.board.innerHTML = 'El juego ya va a comenzar...';
    switchMyTurn(data);

    setTimeout(() => {
        generateGame(socketGame.deck);
        attachEventListeners();
    }, 3000);
});

socketGame.flipCardServer(data => {
    const card = selectors.board.querySelector(`.card[data-index="${data.cardIndex}"]`);
    if (!card) return;

    state.flippedCards++;
    card.classList.add('flipped');

    card.querySelector('.card-back').innerHTML = emojis[data.serverCardIndex];

    if (state.flippedCards === 2) {
        state.lockBoard = true; 
        
        const flippedCards = selectors.board.querySelectorAll('.flipped:not(.matched)');

        if (state.myTurn && flippedCards.length === 2) { 
            socketGame.checkMatch(
                parseInt(flippedCards[0].getAttribute('data-index')),
                parseInt(flippedCards[1].getAttribute('data-index'))
            );
        }
        if (!state.myTurn) {
             setTimeout(() => {
                state.lockBoard = false;
                flipBackCards();
            }, 1000);
        }
    }
});

socketGame.checkMatchServer( data => {
    switchMyTurn(data);
    
    const flippedCards = selectors.board.querySelectorAll('.flipped:not(.matched)');
    
    if (data.isMatch && flippedCards.length === 2) {
        flippedCards[0].classList.add('matched');
        flippedCards[1].classList.add('matched');
        state.lockBoard = false;
        state.flippedCards = 0;
    } 
    
    if (!data.isMatch) {
        setTimeout(() => {
            state.lockBoard = false;
            flipBackCards();
        }, 1000);
    }
    
    if (data.gameOver) {
        selectors.turn.innerHTML = `<h1>Juego Terminado</h1>`;

        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            
            let winText = '';
            if (data.isTie) {
                winText = '¡Es un empate!';
            } else if (data.winner) {
                winText = '¡Has ganado!';
            } else {
                winText = '¡Has perdido!';
            }
            
            selectors.win.innerHTML = `
                <span class="win-text">
                    ${winText}<br />
                    con <span class="highlight">${data.myStats.matches.length}</span> aciertos<br />
                    <span class="highlight">${data.myStats.matches.map(item => `${emojis[item]}`).join(' ')}</span>
                </span>
            `;
        }, 1000)
    }
});


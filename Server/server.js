const WebSocket = require('ws');
const PORT = process.env.PORT || 4000;
const wss = new WebSocket.Server({ port: PORT });

console.log(`✅ WebSocket server running on ws://localhost:${PORT}`);

const board = new Array(25).fill(0);
let players = { ODD: null, EVEN: null };
let gameOver = false;
let winningLine = null;

function send(ws, obj) {
    try {
        ws.send(JSON.stringify(obj));
    } catch (err) {
        console.error('send error', err);
    }
}

function broadcast(obj) {
    const raw = JSON.stringify(obj);
    wss.clients.forEach((c) => {
        if (c.readyState === WebSocket.OPEN) c.send(raw);
    });
}

function checkWin(boardArr) {
    const lines = [
        [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
    ];

    for (const line of lines) {
        const vals = line.map(i => boardArr[i]);
        const allOdd = vals.every(v => v > 0 && v % 2 === 1);
        const allEven = vals.every(v => v > 0 && v % 2 === 0);
        if (allOdd) return { winner: 'ODD', line };
        if (allEven) return { winner: 'EVEN', line };
    }
    return null;
}

function bothPlayersConnected() {
    return players.ODD !== null && players.EVEN !== null;
}

function resetGame() {
    for (let i = 0; i < board.length; i++) {
        board[i] = 0;
    }
    gameOver = false;
    winningLine = null;
    console.log('Game has been reset');
}

wss.on('connection', (ws) => {
    console.log('connect')
    ws.isAlive = true;

    if (!players.ODD) {
        players.ODD = ws;
        ws.player = 'ODD';
    } else if (!players.EVEN) {
        players.EVEN = ws;
        ws.player = 'EVEN';
    } else {
        ws.player = 'SPECTATOR';
    }

    send(ws, { type: 'PLAYER_ASSIGNED', player: ws.player, board: [...board], gameOver, winningLine, bothPlayersConnected: bothPlayersConnected() });
    broadcast({ type: 'PLAYERS_STATUS', oddConnected: players.ODD !== null, evenConnected: players.EVEN !== null });

    ws.on('message', (raw) => {
        let msg;
        try { msg = JSON.parse(raw); }
        catch (err) { return send(ws, { type: 'ERROR', message: 'Invalid JSON' }); }

        if (msg.type === 'INCREMENT') {
            if (gameOver) return send(ws, { type: 'ERROR', message: 'Game is over' });
            if (!bothPlayersConnected()) return send(ws, { type: 'ERROR', message: 'Waiting for both players to connect' });
            if (ws.player !== 'ODD' && ws.player !== 'EVEN') return send(ws, { type: 'ERROR', message: 'Not a player' });
            const idx = Number(msg.square);
            if (!Number.isInteger(idx) || idx < 0 || idx >= 25) return send(ws, { type: 'ERROR', message: 'Index out of range' });

            board[idx] = board[idx] + 1;

            broadcast({ type: 'UPDATE', square: idx, value: board[idx] });

            const win = checkWin(board);
            if (win) {
                gameOver = true;
                winningLine = win.line;
                broadcast({ type: 'GAME_OVER', winner: win.winner, winningLine: win.line });
            }

            return;
        }

        if (msg.type === 'RESET') {
            resetGame();
            broadcast({ type: 'GAME_RESET', board: [...board] });
            return;
        }
    });

    ws.on('close', () => {
        console.log('Player disconnected:', ws.player);

        if (ws.player === 'ODD') players.ODD = null;
        if (ws.player === 'EVEN') players.EVEN = null;

        if (!gameOver && (ws.player === 'ODD' || ws.player === 'EVEN')) {
            gameOver = true;
            broadcast({ type: 'OPPONENT_DISCONNECTED', player: ws.player });
        } else {
            broadcast({ type: 'PLAYERS_STATUS', oddConnected: players.ODD !== null, evenConnected: players.EVEN !== null });
        }
    });

    ws.on('error', (err) => console.error('ws error', err));
});
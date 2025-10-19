import { useEffect, useState, useRef } from 'react'
import Board from './components/Board';
import './App.css'

function App() {
  const [board, setBoard] = useState(Array(25).fill(0));
  const [player, setPlayer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [oddConnected, setOddConnected] = useState(false);
  const [evenConnected, setEvenConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:4000');

    ws.current.onopen = () => {
      console.log('Connected to server');
    };

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log('Received message:', msg);

      if (msg.type === 'PLAYER_ASSIGNED') {
        setPlayer(msg.player);
        setBoard(msg.board);
        setWinningLine(msg.winningLine);
        if (msg.bothPlayersConnected) {
          setOddConnected(true);
          setEvenConnected(true);
        }
      } else if (msg.type === 'UPDATE') {
        console.log(`Update square ${msg.square} to value ${msg.value}`);
        setBoard(prev => {
          const newBoard = [...prev];
          newBoard[msg.square] = msg.value;
          console.log('board:', newBoard);
          return newBoard;
        });
      } else if (msg.type === 'GAME_OVER') {
        setGameOver(true);
        setWinner(msg.winner);
        setWinningLine(msg.winningLine);
        console.log('Game Over! Winner:', msg.winner);
      } else if (msg.type === 'PLAYERS_STATUS') {
        setOddConnected(msg.oddConnected);
        setEvenConnected(msg.evenConnected);
        console.log('Players status:', { odd: msg.oddConnected, even: msg.evenConnected });
      } else if (msg.type === 'OPPONENT_DISCONNECTED') {
        setGameOver(true);
        alert(`Player ${msg.player} disconnected!`);
      } else if (msg.type === 'ERROR') {
        console.error('Server error:', msg.message);
        alert(`Error: ${msg.message}`);
      } else if (msg.type === 'GAME_RESET') {
        console.log('Game has been reset');
        setBoard(msg.board);
        setGameOver(false);
        setWinner(null);
        setWinningLine(null);
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from server');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleOnClick = (index) => {
    console.log('Click on index:', index);
    console.log('State:', { gameOver, wsReady: !!ws.current, boardValue: board[index], oddConnected, evenConnected });

    if (gameOver) {
      console.log('Game is over');
      return;
    }

    if (!ws.current) {
      console.log('WebSocket not connected');
      return;
    }

    if (!oddConnected || !evenConnected) {
      console.log('Waiting for both players');
      alert('Waiting for both players to connect');
      return;
    }

    console.log('Sending INCREMENT message');
    ws.current.send(JSON.stringify({ type: 'INCREMENT', square: index }));
  };

  const handleReset = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'RESET' }));
      console.log('Sent RESET request');
    }
  };

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2>Player: <strong>{player || 'Connecting...'}</strong></h2>
        <p>ODD Player: <strong style={{ color: oddConnected ? 'green' : 'red' }}>{oddConnected ? '✓ Connected' : '✗ Disconnected'}</strong></p>
        <p>EVEN Player: <strong style={{ color: evenConnected ? 'green' : 'red' }}>{evenConnected ? '✓ Connected' : '✗ Disconnected'}</strong></p>
        {(!oddConnected || !evenConnected) && !gameOver && (
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'orange' }}>
            ⏳ Waiting for opponent...
          </p>
        )}
      </div>
      <Board board={board} handleOnClick={handleOnClick} winningLine={winningLine} />
      {gameOver && winner && (
        <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: 'gold', marginTop: '20px' }}>
          🏆 Winner: {winner}!
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={handleReset} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          🔄 Reset Game
        </button>
      </div>
    </>
  )
}

export default App

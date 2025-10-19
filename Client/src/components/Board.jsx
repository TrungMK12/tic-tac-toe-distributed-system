import Square from './Square';

function Board({ board, handleOnClick, winningLine }) {
    const isWinningSquare = (index) => {
        return winningLine && winningLine.includes(index);
    };

    return (
        <div className="board">
            <div className="board-row">
                <Square value={board[0]} handleOnClick={() => handleOnClick(0)} isWinning={isWinningSquare(0)} />
                <Square value={board[1]} handleOnClick={() => handleOnClick(1)} isWinning={isWinningSquare(1)} />
                <Square value={board[2]} handleOnClick={() => handleOnClick(2)} isWinning={isWinningSquare(2)} />
                <Square value={board[3]} handleOnClick={() => handleOnClick(3)} isWinning={isWinningSquare(3)} />
                <Square value={board[4]} handleOnClick={() => handleOnClick(4)} isWinning={isWinningSquare(4)} />
            </div>
            <div className="board-row">
                <Square value={board[5]} handleOnClick={() => handleOnClick(5)} isWinning={isWinningSquare(5)} />
                <Square value={board[6]} handleOnClick={() => handleOnClick(6)} isWinning={isWinningSquare(6)} />
                <Square value={board[7]} handleOnClick={() => handleOnClick(7)} isWinning={isWinningSquare(7)} />
                <Square value={board[8]} handleOnClick={() => handleOnClick(8)} isWinning={isWinningSquare(8)} />
                <Square value={board[9]} handleOnClick={() => handleOnClick(9)} isWinning={isWinningSquare(9)} />
            </div>
            <div className="board-row">
                <Square value={board[10]} handleOnClick={() => handleOnClick(10)} isWinning={isWinningSquare(10)} />
                <Square value={board[11]} handleOnClick={() => handleOnClick(11)} isWinning={isWinningSquare(11)} />
                <Square value={board[12]} handleOnClick={() => handleOnClick(12)} isWinning={isWinningSquare(12)} />
                <Square value={board[13]} handleOnClick={() => handleOnClick(13)} isWinning={isWinningSquare(13)} />
                <Square value={board[14]} handleOnClick={() => handleOnClick(14)} isWinning={isWinningSquare(14)} />
            </div>
            <div className="board-row">
                <Square value={board[15]} handleOnClick={() => handleOnClick(15)} isWinning={isWinningSquare(15)} />
                <Square value={board[16]} handleOnClick={() => handleOnClick(16)} isWinning={isWinningSquare(16)} />
                <Square value={board[17]} handleOnClick={() => handleOnClick(17)} isWinning={isWinningSquare(17)} />
                <Square value={board[18]} handleOnClick={() => handleOnClick(18)} isWinning={isWinningSquare(18)} />
                <Square value={board[19]} handleOnClick={() => handleOnClick(19)} isWinning={isWinningSquare(19)} />
            </div>
            <div className="board-row">
                <Square value={board[20]} handleOnClick={() => handleOnClick(20)} isWinning={isWinningSquare(20)} />
                <Square value={board[21]} handleOnClick={() => handleOnClick(21)} isWinning={isWinningSquare(21)} />
                <Square value={board[22]} handleOnClick={() => handleOnClick(22)} isWinning={isWinningSquare(22)} />
                <Square value={board[23]} handleOnClick={() => handleOnClick(23)} isWinning={isWinningSquare(23)} />
                <Square value={board[24]} handleOnClick={() => handleOnClick(24)} isWinning={isWinningSquare(24)} />
            </div>
        </div>
    )
}

export default Board
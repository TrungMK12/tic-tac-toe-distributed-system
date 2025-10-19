function Square({ value, handleOnClick, isWinning }) {
    const isOdd = value > 0 && value % 2 === 1;
    const isEven = value > 0 && value % 2 === 0;

    return (
        <button
            className={`square ${isWinning ? 'winning' : ''} ${isOdd ? 'odd' : ''} ${isEven ? 'even' : ''}`}
            onClick={handleOnClick}
            style={{
                backgroundColor: isWinning ? '#ffd700' : isOdd ? '#ffcccc' : isEven ? '#ccccff' : '#fff',
                fontWeight: 'bold',
                fontSize: '20px'
            }}
        >
            {value === 0 ? '' : value}
        </button>
    )
}

export default Square
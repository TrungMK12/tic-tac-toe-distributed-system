# 🎮 Multiplayer Odd/Even Tic-Tac-Toe

A real-time multiplayer game built with React and WebSocket demonstrating distributed systems concepts including server authority and operational transforms.

## 📖 Game Rules

### Setup
- **5x5 board** with 25 squares
- All squares start at **0**
- First player is the **Odd Player** 🔴
- Second player is the **Even Player** 🔵

### Gameplay
- Click any square to **increment** its number by 1 (0→1→2→3→4...)
- **Both players can click any square at any time** (no turns!)
- Multiple clicks on the same square keep incrementing it

### Winning Conditions
- **Odd Player wins** 🏆 if any row, column, or diagonal has all 5 **odd numbers**
  - Example: `[1, 3, 5, 7, 9]` or `[1, 1, 1, 1, 1]`
- **Even Player wins** 🏆 if any row, column, or diagonal has all 5 **even numbers**
  - Example: `[2, 4, 6, 8, 10]` or `[4, 6, 8, 8, 8]`

### Strategy
- **Odd player** clicks squares to make/keep them odd
- **Even player** clicks squares to make/keep them even
- Fighting over the same squares is the game!
- If both players click a square with 5, it becomes 7 (stays odd)
- If both players click a square with 4, it becomes 6 (stays even)

---

## 🏗️ Architecture

### Server Authority Pattern
The server maintains the **single source of truth** for the game state.

```
Client clicks square 12
    ↓
Client sends: { type: 'INCREMENT', square: 12 }
    ↓
Server receives and processes: board[12] += 1
    ↓
Server broadcasts: { type: 'UPDATE', square: 12, value: 6 }
    ↓
ALL clients update their UI (including the one who clicked)
```

### Operational Transforms
Instead of sending states, we send **operations** that compose naturally:

**❌ Wrong (State-based):**
```javascript
// Problem: Conflicts when simultaneous
{ type: 'SET_VALUE', square: 12, value: 6 }
```

**✅ Correct (Operation-based):**
```javascript
// Solution: Operations compose naturally
{ type: 'INCREMENT', square: 12 }
```

**Why this matters:**
```
Square 12 = 5
Player ODD clicks  → Server: 5 → 6 → broadcasts UPDATE
Player EVEN clicks → Server: 6 → 7 → broadcasts UPDATE
Result: BOTH clicks counted! ✓
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Web_Socket
```

2. **Install server dependencies**
```bash
cd Server
npm install
```

3. **Install client dependencies**
```bash
cd ../Client
npm install
```

### Running the Application

1. **Start the WebSocket server**
```bash
cd Server
node server.js
```
Server will start on `ws://localhost:4000`

2. **Start the React client** (in a new terminal)
```bash
cd Client
npm run dev
```
Client will start on `http://localhost:5173` (or similar)

3. **Open two browser tabs**
- Tab 1 → Becomes **ODD Player**
- Tab 2 → Becomes **EVEN Player**

4. **Play!** 🎮

---

## 📁 Project Structure

```
Web_Socket/
├── Client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.jsx      # 5x5 game board
│   │   │   ├── Square.jsx     # Individual square component
│   │   │   └── GameInfo.jsx   # Game information display
│   │   ├── App.jsx            # Main app with WebSocket logic
│   │   ├── App.css            # Styling
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── Server/                 # WebSocket server
│   ├── server.js              # Main server logic
│   └── package.json
│
└── README.md
```

---

## 🔌 WebSocket Protocol

### Client → Server Messages

#### Increment Square
```javascript
{
  type: 'INCREMENT',
  square: 12  // 0-24
}
```

#### Reset Game
```javascript
{
  type: 'RESET'
}
```

### Server → Client Messages

#### Player Assignment (on connect)
```javascript
{
  type: 'PLAYER_ASSIGNED',
  player: 'ODD',  // or 'EVEN' or 'SPECTATOR'
  board: [0, 0, 0, ...],  // current board state (25 elements)
  gameOver: false,
  winningLine: null,
  bothPlayersConnected: true
}
```

#### Board Update
```javascript
{
  type: 'UPDATE',
  square: 12,
  value: 6
}
```

#### Game Over
```javascript
{
  type: 'GAME_OVER',
  winner: 'ODD',  // or 'EVEN'
  winningLine: [0, 6, 12, 18, 24]  // winning squares
}
```

#### Players Status
```javascript
{
  type: 'PLAYERS_STATUS',
  oddConnected: true,
  evenConnected: true
}
```

#### Opponent Disconnected
```javascript
{
  type: 'OPPONENT_DISCONNECTED',
  player: 'ODD'  // who disconnected
}
```

#### Game Reset
```javascript
{
  type: 'GAME_RESET',
  board: [0, 0, 0, ...]
}
```

#### Error
```javascript
{
  type: 'ERROR',
  message: 'Game is over'
}
```

---

## 🎯 Key Features

### ✅ Server Authority
- Server is the single source of truth
- Prevents cheating and ensures consistency
- All clients stay synchronized

### ✅ Operational Transforms
- Operations (INCREMENT) instead of states (SET_VALUE)
- Handles simultaneous clicks correctly
- Both clicks count when players click at the same time

### ✅ Real-time Synchronization
- WebSocket bidirectional communication
- Instant updates for all connected players
- Live connection status

### ✅ Win Detection
- Checks all 12 possible winning lines:
  - 5 horizontal rows
  - 5 vertical columns
  - 2 diagonals

### ✅ Game Management
- Automatic player assignment (ODD/EVEN)
- Cannot play until both players connected
- Game ends when player disconnects
- Reset game functionality

### ✅ Visual Feedback
- Color-coded squares:
  - 🔴 Red tint for odd numbers
  - 🔵 Blue tint for even numbers
  - 🌟 Gold highlight for winning line
- Connection status indicators
- Clear winner announcement

---

## 🧪 Testing Simultaneous Clicks

To verify operational transforms work correctly:

1. Open browser DevTools (F12) → Console
2. In both tabs, quickly click the same square
3. Watch console logs:
   ```
   📨 Received message: { type: 'UPDATE', square: 12, value: 6 }
   📨 Received message: { type: 'UPDATE', square: 12, value: 7 }
   ```
4. Both clicks are counted! ✓

---

## 🎨 UI Features

- **Color-coded player roles** (ODD/EVEN)
- **Live connection status** (Connected/Disconnected)
- **Waiting indicator** when opponent not connected
- **Game instructions** displayed below board
- **Winner announcement** with trophy emoji 🏆
- **Reset button** to start new game
- **Visual square states:**
  - Empty: white
  - Odd number: light red
  - Even number: light blue
  - Winning line: gold

---

## 🛠️ Technologies Used

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **WebSocket API** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **ws** - WebSocket library
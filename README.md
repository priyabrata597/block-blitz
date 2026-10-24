🎮 BLOCK BLITZ

BLOCK BLITZ is a browser-based block puzzle game built with React. Place blocks on an 8×8 grid, complete rows and columns, earn points, and try to beat your personal best.

✨ Features

- 8×8 Game Board — Place pieces strategically on the grid.
- Multiple Block Shapes — Choose from different block shapes and sizes.
- Row and Column Clearing — Complete rows or columns to clear cells and score points.
- Scoring System — Earn points for placing blocks and clearing lines.
- Game Over and Restart — Start a new game when no available piece can be placed.
- Player Dashboard — View player information, best score, and total games.
- Backend Integration — Send game results to the backend for storage.
- MongoDB Database — Store game results using MongoDB and Mongoose.
- Responsive Interface — Play through a layout designed to accommodate different screen sizes.

🛠️ Technologies Used

Frontend

- React
- JavaScript
- HTML5
- CSS3
- Vite

Backend and Database

- Node.js
- Express.js
- MongoDB
- Mongoose

📁 Project Structure

Block Blitz/
├── client/          # React frontend
├── server/          # Backend API
├── GAME-PLAN.md     # Game requirements and development plan
└── README.md        # Project documentation

🚀 Getting Started

Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB connection details for the backend

1. Run the Frontend

Open a terminal and navigate to the client directory:

cd client
npm install
npm run dev

Open the local URL displayed in the terminal.

2. Configure and Run the Backend

Open a second terminal in the project directory and run:

cd server
npm install

Create a ".env" file inside the "server" directory and add your MongoDB connection string:

MONGODB_URI=your_mongodb_connection_string
PORT=5000

Replace the placeholder with your actual MongoDB connection string. Keep this file private and never commit it to GitHub.

Start the backend:

node server.js

The backend runs on port "5000" by default. Keep this terminal open while playing the game.

Backend API Endpoints

Method| Endpoint| Purpose
GET| "/api/health"| Check backend status
POST| "/api/Score"| Save a game result
GET| "/api/dashboard?playerName=..."| Retrieve a player's dashboard statistics

Important: Never commit your ".env" file, MongoDB connection string, or database credentials to GitHub.

🎯 How to Play

1. Start a game.
2. Select an available block piece.
3. Place it on the board without overlapping occupied cells or going outside the grid.
4. Complete rows and columns to clear cells and earn points.
5. Continue placing pieces while valid moves remain.
6. Try to achieve a new personal best.

🔮 Future Improvements

Potential improvements include:

- Player authentication and individual accounts
- A global leaderboard
- Game history and detailed statistics
- Additional gameplay enhancements

📌 Project Status

BLOCK BLITZ is an actively developed full-stack project. Its frontend, backend integration, and database functionality are being developed and refined.

---

Built as a learning and development project.
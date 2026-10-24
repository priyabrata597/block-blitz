BLOCK BLITZ — Game Plan

1. Project Overview

BLOCK BLITZ is a browser-based, single-player block puzzle game built with React. Players place different block shapes on an 8×8 grid, clear completed rows and columns, and try to achieve their highest score.

2. Core Gameplay

- Use an 8×8 game board.
- Provide three available block pieces at a time.
- Support different block shapes and sizes.
- Do not allow block rotation.
- Allow players to select and place available pieces.
- Prevent pieces from extending outside the board.
- Prevent pieces from overlapping occupied cells.
- Reject invalid placements.
- Generate new pieces when the available pieces have been used.

3. Line Clearing

- Clear a row when all its cells are occupied.
- Clear a column when all its cells are occupied.
- Allow multiple completed rows and columns to clear in one move.
- Make cleared cells available for future placements.
- Provide visual feedback for gameplay events where implemented.

4. Scoring System

- Award points for placing blocks.
- Award points for clearing completed rows and columns.
- Support bonus points for multiple line clears in one move, according to the implemented scoring rules.
- Display the current score during gameplay.
- Track the player's best score.

5. Game Over and Restart

- Check whether any available piece can be placed legally on the board.
- End the game when none of the available pieces can be placed.
- Display the final score and best score.
- Provide an option to play again.

6. Frontend Features

- React-based user interface.
- Interactive 8×8 game board.
- Block selection and placement.
- Score and best-score tracking.
- Game-over screen and restart functionality.
- Player dashboard with player-specific statistics.
- Responsive layout and touch-friendly interaction.

7. Backend and Database

- Node.js and Express.js backend.
- MongoDB database integration using Mongoose.
- Health-check endpoint: "GET /api/health".
- Game-result endpoint: "POST /api/Score".
- Dashboard statistics endpoint: "GET /api/dashboard?playerName=...".
- Basic validation of player names, scores, and best scores before saving game results.
- Store game results and retrieve player-specific dashboard statistics.

8. Technologies Used

Frontend

- React
- JavaScript
- HTML5
- CSS3
- Vite

Backend

- Node.js
- Express.js
- CORS
- dotenv

Database

- MongoDB
- Mongoose

9. Future Improvements

- Player registration and authentication.
- A global leaderboard.
- Detailed game history and additional statistics.
- Stronger server-side validation and score-integrity checks.
- Further gameplay improvements and testing.

10. Project Status

BLOCK BLITZ has a working frontend, backend API integration, and MongoDB connectivity. Core gameplay, scoring, player dashboard functionality, and game-result storage have been developed.

Further testing, refinements, and future improvements remain part of the development process.
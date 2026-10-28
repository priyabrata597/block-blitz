🎮 BLOCK BLITZ

BLOCK BLITZ is a browser-based block puzzle game built with React, Vite, Node.js, Express, and MongoDB. Place blocks on an 8×8 grid, clear complete rows and columns, earn points, and compete for a place on the global leaderboard.

🎮 Live Demo

Play BLOCK BLITZ: https://block-blitz-rddsoige4-priyabrata-s-project.vercel.app/

Experience the game directly in your browser.

✨ Features

- 8×8 Game Board — Place blocks strategically without overlapping occupied cells.
- Multiple Block Shapes — Play with a variety of block shapes and sizes.
- Row and Column Clearing — Complete rows and columns to clear cells and earn bonus points.
- Scoring System — Earn points for placing blocks and clearing lines.
- Game Over Detection — The game ends when none of the available pieces can be placed.
- Player Authentication — Register and log in with an account.
- Secure Password Handling — Passwords are hashed using bcrypt.
- JWT Authentication — Protect authenticated API endpoints using JSON Web Tokens.
- Player Dashboard — View your personal best score and total games played.
- Persistent Game Results — Save completed game results to MongoDB.
- Global Leaderboard — View the top 10 players ranked by best score.
- Sound and Background Music — Toggle gameplay sounds and background music.
- Theme Support — Switch between dark and light themes.

🛠️ Technologies Used

Frontend

- React
- JavaScript
- HTML5
- CSS3
- Vite

Backend

- Node.js
- Express.js
- bcryptjs
- JSON Web Token (JWT)
- CORS
- dotenv

Database

- MongoDB Atlas
- Mongoose

Development Tools

- Git and GitHub
- Visual Studio Code
- npm

📁 Project Structure

Block-blitz/
├── client/              # React and Vite frontend
├── server/              # Express backend and database models
├── .gitignore           # Files excluded from Git
├── GAME-PLAN.md         # Game requirements and development plan
└── README.md            # Project documentation

🚀 Getting Started

Prerequisites

Install the following:

- "Node.js" (https://nodejs.org/)
- npm, included with Node.js
- A MongoDB database, such as MongoDB Atlas
- Git

1. Clone the Repository

git clone YOUR_GITHUB_REPOSITORY_URL
cd Block-blitz

Replace "YOUR_GITHUB_REPOSITORY_URL" with the actual URL of this repository.

2. Configure the Backend

Open a terminal in the project root:

cd server
npm install

Create a ".env" file inside the "server" directory:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000

Replace the placeholders with your actual values.

- "MONGODB_URI": Your MongoDB connection string.
- "JWT_SECRET": A strong, private random secret used to sign authentication tokens.
- "PORT": The backend port. The application defaults to "5000" if this variable is omitted.

Security: Never commit ".env" files, database credentials, or JWT secrets to GitHub.

Start the backend:

node server.js

The backend should connect to MongoDB and start listening on the configured port.

3. Run the Frontend

Open a second terminal from the project root:

cd client
npm install
npm run dev

Open the local URL printed by Vite in your browser.

Keep both development servers running while testing the application.

«API configuration: The frontend currently uses a local backend URL in "client/src/api.js". Before production deployment, configure it to use the deployed backend URL instead.»

🔌 Backend API Endpoints

Method| Endpoint| Purpose| Authentication
GET| "/api/health"| Check backend availability| No
POST| "/api/auth/register"| Register an account| No
POST| "/api/auth/login"| Log in and receive a token| No
GET| "/api/auth/me"| Retrieve the current user's details| Yes
POST| "/api/Score"| Save a completed game result| Yes
GET| "/api/dashboard"| Retrieve personal dashboard statistics| Yes
GET| "/api/leaderboard"| Retrieve the global top 10 leaderboard| No

Authenticated requests must include an authorization header:

Authorization: Bearer YOUR_JWT_TOKEN

🎯 How to Play

1. Register a new account or log in.
2. Open your player dashboard and start a game.
3. Select one of the available block pieces.
4. Place the piece on the grid without overlapping occupied cells or going outside the board.
5. Complete rows and columns to clear cells and earn points.
6. Continue playing while at least one available piece can fit.
7. At Game Over, review your final score and best score.
8. Return to your dashboard or check the global leaderboard.

☁️ Deployment

The application can be deployed using separate services for the frontend and backend, with MongoDB Atlas providing the database.

Planned deployment setup:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

Before deploying, configure the production API URL, backend environment variables, CORS settings, and MongoDB Atlas network access.

Live application and deployment URLs will be added here after deployment is completed and verified.

🔒 Security Notes

- Store database credentials and JWT secrets in environment variables.
- Never publish ".env" files or private credentials.
- Use HTTPS for production traffic.
- Configure CORS to allow the intended frontend origin in production.
- Use a strong JWT secret and keep it private.
- Restrict database network access appropriately.

🔮 Potential Future Improvements

- Game history and detailed statistics
- Additional block shapes and gameplay modes
- Improved animations and visual effects
- Enhanced accessibility and mobile interaction
- Additional leaderboard and player statistics features

📌 Project Status

BLOCK BLITZ includes a React frontend, an Express backend, MongoDB persistence, account authentication, dashboard statistics, and a global leaderboard.

Production deployment and live URL verification are pending.

---

Built as a learning and development project.

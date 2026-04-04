import http from 'http';
import app from './app.js';
import config from './config/index.js';
import connectDB from './config/db.js';
import { initSocket } from './config/socket.js';

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Connect to MongoDB and start server
connectDB().then(() => {
  server.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
  });
});

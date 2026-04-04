const http = require('http');
const app = require('./app');
const config = require('./config');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Connect to MongoDB and start server
connectDB().then(() => {
  server.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
  });
});

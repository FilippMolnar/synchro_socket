// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Socket.io logic
io.on('connection', (socket) => {
    console.log('A user connected');

    // Receive time data from client
    socket.on('timeData', (data) => {
        // Broadcast the time data to all other clients
        socket.broadcast.emit('syncTime', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

setInterval(() => {
    io.emit('syncTime', new Date().getTime());
}, 1000);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

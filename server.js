// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
//----------------------------
const express = require("express");
const serverless = require("serverless-http");
const router = express.Router();
//---------------------------------

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];           // Registered users
let onlineUsers = {};      // Online users with socket IDs

app.use(bodyParser.json());
app.use(express.static('public'));

// Register route
app.post('/register', (req, res) => {
    const { firstName, lastName, mobile, email, address, street, city, state, country, loginId, password } = req.body;

    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    users.push({ firstName, lastName, mobile, email, address, street, city, state, country, loginId, password });
    res.status(201).json({ message: 'Registration successful' });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', email });
});

// Get user details
app.get('/user-details', (req, res) => {
    const { email } = req.query;
    const user = users.find(user => user.email === email);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
});

// Handle Socket.io connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('user_login', (data) => {
        onlineUsers[socket.id] = { email: data.email, socketId: socket.id, status: 'Online' };
        io.emit('update_user_list', Object.values(onlineUsers));
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        delete onlineUsers[socket.id];
        io.emit('update_user_list', Object.values(onlineUsers));
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
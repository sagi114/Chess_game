//coments that for the next time it will be easy

//adding express
//for getting express i nedded to install
//npm install express
const express = require('express');
const http = require('http');
//socket -that we comunicate in real time
//npm install socket.io
const socketIo = require('socket.io');

//open and run server
const server = http.createServer(app);
const app = express();
// Import database module
//could be wrong
const db = require('./DataBase/database');; 
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser'); // For parsing POST request body
app.use(bodyParser.json());
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Listen for 'addUser' event from client
    socket.on('addUser', (user) => {
        // Create a new User instance with data received from the client
        const newUser = new User({
            username: user.username,
            email: user.email,
            age: user.age,
        });

        // Save the new user to the database
        newUser.save((err, savedUser) => {
            if (err) {
                console.error('Error saving user to database:', err);
                // Emit an error event to the client
                socket.emit('addUserError', { error: 'Error saving user to database' });
            } else {
                console.log('User saved to database:', savedUser);
                // Emit a success event to the client
                socket.emit('addUserSuccess', savedUser);
            }
        });
    });
});

//when socket is on we could get information from client
// io.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });

//     socket.on('message', (data) => {
//         console.log('Received message:', data);
//         // Broadcast the received message to all connected clients
//         io.emit('message', data);
//     });
// });
// const { User } =db;

// // Example route handler to save a new user
// app.post('/users', (req, res) => {
//     const newUser = new User({
//         username: req.body.username,
//         email: req.body.email,
//         age: req.body.age,
//     });

//     newUser.save((err, savedUser) => {
//         if (err) return res.status(500).send(err);
//         res.status(201).json(savedUser);
//     });
// });
//server is connected
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

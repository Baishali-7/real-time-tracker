const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

console.log('Serving static files from:', path.join(__dirname, 'public'));


io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

   
    socket.on("send-location", (data) => {
        console.log(`Received location from ${socket.id}:`, data);

       
        const { latitude, longitude } = data;
        if (typeof latitude === 'number' && typeof longitude === 'number') {
            
            io.emit("receive-location", { id: socket.id, latitude, longitude });
        } else {
            console.warn(`Invalid location data received from ${socket.id}:`, data);
        }
    });

   
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        io.emit('user-disconnected', socket.id);
    });
});


app.get('/', (req, res) => {
    res.render('index');
});


server.listen(3000, () => {
    console.log('Server is listening on http://localhost:3000');
});

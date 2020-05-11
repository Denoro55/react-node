const users = {};

module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('connected', function(data) {
            console.log('socket connected', data);

            // room id of one user with a multiple tabs
            console.log('join room', data.id);
            socket.join(data.id);

            // if (!users[data.id]) {
            //     users[data.id] = [];
            // }
            //
            // if (data.id) {
            //     users[data.id].push(socket);
            //     socket.userId = data.id;
            // }

            console.log(users);
        });

        socket.on('sendMessage', function(data) {
            io.to(data.toId).emit('getMessage', data);
            io.to(data.fromId).emit('getMessage', data);
        });

        socket.on('disconnect', function() {
            // const socketId = socket.id;
            // const userId = socket.userId;
            //
            // if (users.hasOwnProperty(userId)) {
            //     users[userId] = users[userId].filter(s => s.id !== socketId);
            // }

            console.log('disconnect',users);
        })
    });
};

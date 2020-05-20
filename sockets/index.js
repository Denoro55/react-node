const WALL_PREFIX_ROOM = 'WALL_';

const getWallRoom = (id) => `${WALL_PREFIX_ROOM}${id}`;

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

            // console.log(users);
        });

        socket.on('sendMessage', function(data) {
            io.to(data.toId).emit('getMessage', data);
            io.to(data.fromId).emit('getMessage', data);
        });

        socket.on('createPost', function(data) {
            const { post, toId } = data;
            io.to(getWallRoom(toId)).emit('createPost', {post});
        });

        socket.on('sendPostData', function(data) {
            const { post, toId } = data;
            io.to(toId).emit('sendPostData', {post});
        });

        socket.on('removePost', function(data) {
            const { postId, toId } = data;
            io.to(getWallRoom(toId)).emit('removePost', {postId});
        });

        socket.on('likePost', function(data) {
            const { post, toId, userId } = data;
            io.to(getWallRoom(toId)).emit('likePost', {post, userId});
        });

        socket.on('createComment', function(data) {
            const { comments, toId, postId } = data;
            io.to(getWallRoom(toId)).emit('createComment', {comments, postId});
        });

        socket.on('likeComment', function(data) {
            const { comment, toId, userId, postId } = data;
            io.to(getWallRoom(toId)).emit('likeComment', {comment, userId, postId});
        });

        socket.on('leaveRoom', function(data) {
            socket.leave(data.id);
        });

        // walls
        socket.on('connectToWallId', function(data) {
            const { wallId } = data;
            socket.join(getWallRoom(wallId));
        });

        socket.on('disconnectToWallId', function(data) {
            const { wallId } = data;
            socket.leave(getWallRoom(wallId));
        });

        // counters
        socket.on('follow', function(data) {
            const {toId, isFollowing} = data;

            io.to(toId).emit('follow', {toId, isFollowing});
        });

        socket.on('disconnect', function() {
            // const socketId = socket.id;
            // const userId = socket.userId;
            //
            // if (users.hasOwnProperty(userId)) {
            //     users[userId] = users[userId].filter(s => s.id !== socketId);
            // }

            console.log('disconnect');
        })
    });
};

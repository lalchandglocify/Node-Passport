exports = module.exports = function(io,mongoose){
users = [];
io.sockets.on('connection', function(socket) {
    //new user login
    const User = mongoose.model('User');
    const Messages = require('../models/Message');
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            //socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        };
    });
    //user leaves
    socket.on('disconnect', function() {
        if (socket.nickname != null) {
            //users.splice(socket.userIndex, 1);
            users.splice(users.indexOf(socket.nickname), 1);
            socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        }
    });
    //new message get
    socket.on('postMsg', function(msg, color,sender,conversationId) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color,sender);
        let chatMessage = new Messages({ message: msg,senderId: sender, senderName: socket.nickname,conversationId:conversationId });

        chatMessage.save();
    });
    //new image get
    socket.on('img', function(imgData, color) {
        socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });
});
}
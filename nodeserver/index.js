const io = require("socket.io")(8000, {
    cors: { origin: "*" }
});

const users = {};

io.on("connection", socket => {
    socket.on('new-user-joined', name => {
        if (name && name.trim() !== "") {
            users[socket.id] = name;
            socket.broadcast.emit('user-joined', name);
        }
    });

    socket.on("send", message => {
        if (users[socket.id]) {
            socket.broadcast.emit("receive", { message: message, name: users[socket.id] });
        }
    });

    socket.on("typing", () => {
        if (users[socket.id]) {
            socket.broadcast.emit("user-typing", users[socket.id]);
        }
    });

    socket.on("stop-typing", () => {
        socket.broadcast.emit("user-stop-typing");
    });

    socket.on("disconnect", () => {
        if (users[socket.id]) {
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.id];  // Remove user from the list
        }
    });
});

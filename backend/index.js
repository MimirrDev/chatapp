const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*"}
});

io.on("connection", (socket) => {
    console.log("Kullanıcı bağlandı:", socket.id);

    socket.on("join_room", (room) => {
        socket.join(room)
        console.log(`${socket.id} odaya katıldı: ${room}`);
    });

    socket.on("send_message", (data) => {
        console.log("Mesaj geldi:", data)
        io.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("Kullanıcı ayrıldı:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server çalışıyor: ${PORT}`));
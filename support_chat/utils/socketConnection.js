const socketIo = require("socket.io");

module.exports = (httpServer) => {
  const io = socketIo(httpServer, {
    cors: {
      origin: "*",
    },
  });
  return io;
};

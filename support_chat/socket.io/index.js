const {
  initConnectionUser,
  initConnectionSupport,
  chatuser,
chatsupport,
} = require("./namespaces.socket");

module.exports = socketHandler = (io) => {
  initConnectionUser(io);
  initConnectionSupport(io)
  chatuser(io);
  chatsupport(io);

};

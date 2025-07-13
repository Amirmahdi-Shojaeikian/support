const {
  initConnectionUserInternal,

} = require("./namespaces.socket");

module.exports = socketHandler = (io) => {
  initConnectionUserInternal(io);
};

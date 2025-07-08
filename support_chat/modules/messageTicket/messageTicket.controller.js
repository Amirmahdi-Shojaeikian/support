const msgModel = require("../../models/messageTicket");
const { logActivity } = require("../../utils/createActivity");

exports.addExternal = async (req, res) => {
  try {
    const { message,ticketId } = req.body;
    const createMsg = await msgModel.create({ message,ticketId,userId:req.userExternal._id })

    return res.status(201).json(createMsg);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};


exports.addInternal = async (req, res) => {
  try {
    const { message,ticketId } = req.body;
    const createMsg = await msgModel.create({ message,ticketId,userId:req.userInternal._id })

    return res.status(201).json(createMsg);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};



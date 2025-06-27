const { v4: uuidv4 } = require("uuid");
const userModel = require("./../models/user")

exports.loginUser = async (req,res) => {
    try {
      const {
        name,
        email,
        phonNumber
      } =
        req.body;
  
      let user = await userModel.findOne({$or : [ {email} , {phonNumber} ]});
  
      if(!user){
        user = await userModel.create({
        name,
        email,
        phonNumber,
        roomId :uuidv4()
        });
        return res.status(201).json(user);
      }
  
      return res.status(200).json(user);
  
    } catch (error) {
      console.log(error);
      return res.json({ error: error });
    }
  }
  
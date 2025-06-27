const userAdminModel = require("./../../models/userAdmin");
const bcrypt = require("bcrypt");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../middlewares/token.auth");

exports.register = async (req, res) => {
  try {
    const { username,name,password,phoneNumber,email } =req.body;

    const createUserAdmin = await userAdminModel.create({
      username,name,password,phoneNumber,email
    });

    return res.status(201).json({message : "ثبت نام با موفقیت انجام شد", user : createUserAdmin});
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.add = async (req, res) => {
  try {
    const {name,username,password,email,phoneNumber,roleId } =req.body;

    const createUserAdmin = await userAdminModel.create({
        name,username,password,email,phoneNumber,roleId
    });

    return res.status(201).json({message : "کاربر با موفقیت اضافه شده", user : createUserAdmin});
  } catch (error) {
    if (
      error.code === 11000 &&
      error.keyPattern &&
      Object.keys(error.keyPattern).length > 0
    ) {
      return res.status(400).json({ message: 'نام کاربری قبلاً ثبت شده' });

    }
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getAll = async (req, res) => {
  try {
    const findUserAdmins = await userAdminModel.find({active : true}).select("name username roleId phoneNumber createdAt updatedAt").lean()

    return res.json(findUserAdmins)
    
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getOneBytoken = async (req, res) => {
  try {
    
    const findUser = await userAdminModel.findOne({_id : req.userAdmin._id}).lean()

    return res.json(findUser)
    
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getOne = async (req, res) => {
  try {
    const {id} = req.params
    const findUser = await userAdminModel.findOne({_id : id}).select("name username roleId phoneNumber createdAt updatedAt").lean()

    return res.json(findUser)
    
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.login = async (req, res) => {
  try {
    const { username , password } = req.body;
    const user = await userAdminModel.findOne({ username });
    if (user) {
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (isValidPassword) {
        const accessToken = generateAccessToken(user._id);
        const updateUser = await userAdminModel.findOneAndUpdate(
            { username },
            { accessToken },
            {
              projection: { accessToken: 1, _id: 0 }, 
              returnDocument: "after",
            }
          );
        res.cookie("access_token", accessToken, { httpOnly: true });        

        return res
          .status(200)
          .json({ message: "ورود با موفقیت ", user : updateUser  });
      }
      return res.status(401).json({ message: "passwords do not match" });
    }
    return res.status(404).json({ message: "user not found" });
  } catch (error) {
    console.log(error);
    return res.json({ error: error });
  }
};
exports.update = async (req, res) => {
  try {
    const { name,username,password,email,phoneNumber,roleId } = req.body;
    const {id} = req.params
    
      const updateData = {};
      updateData.name = name
      updateData.username = username
      updateData.email = email
      updateData.roleId = roleId
      updateData.phoneNumber = phoneNumber

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateData.password = hashedPassword;
      }
  
      const isUser = await userAdminModel.findOneAndUpdate(
        { _id:id },
        updateData,
        { new: true }
      );
  
      if (!isUser) {
        return res.status(404).json({ message: "user not found" });
      }
  
      return res.status(200).json({message : "اطلاعات با موفقیت ویرایش شد"});
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};
exports.delete = async (req, res) => {
  try {
    const {id} = req.params
  
      const isUser = await userAdminModel.findOneAndDelete({ _id:id });

      if (!isUser) {
        return res.status(404).json({ message: "user not found" });
      }
  
      return res.status(200).json({message : "کاربر با موفقیت حذف شد"});
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};

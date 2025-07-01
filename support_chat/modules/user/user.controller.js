const userModel = require("../../models/user");
const {
generateAccessTokenUserInternal,
generateAccessTokenUserExternal
} = require("../../middlewares/token.auth");
const bcrypt = require("bcrypt");


exports.loginIntenal = async (req, res) => {
  try {
    const { username , password } = req.body;
    const user = await userModel.findOne({ username });
    if (user) {
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (isValidPassword) {
        const accessToken = generateAccessTokenUserInternal(user._id,user.organizationId,user.type);
        const updateUser = await userModel.findOneAndUpdate(
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
exports.addInternal = async (req, res) => {
  try {
    const {name,username,email,phonNumber,password,organizationId,roleId } =req.body;

    const findUser = await userModel.findOne({username,organizationId})
    if (findUser) {
      return res.status(400).json({message : "نام کاربری تکراری است"})
    }

    const createUser = await userModel.create({name,username,email,phonNumber,type:"internal",password,organizationId,roleId});

    return res.status(201).json({message : "کاربر با موفقیت اضافه شد", user : createUser});
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getAllInternal = async (req, res) => {
  try {
    const findUser = await userModel.find({type : "internal",organizationId :req.userInternal.organizationId,admin:false})
    .select("name username organizationId phoneNumber createdAt updatedAt")
    // .populate({
    //   path: "organizationId",
    //   select: "name",
    // })
    .lean()

    return res.json(findUser)
    
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getOneInternal = async (req, res) => {
  try {
    const {id} = req.params
    const findRole = await userModel.findOne({_id : id})
    .select("-password")
    .lean()

    return res.json(findRole)
    
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.updateInternal = async (req, res) => {
  try {
    const { name,username,email,phonNumber,password,organizationId,roleId } =req.body;
    const {id} = req.params
    
      const updateData = {};
      updateData.name = name
      updateData.username = username
      updateData.email = email 
      updateData.phonNumber = phonNumber 
      updateData.phonNumber = phonNumber 
      updateData.password = password 
      updateData.organizationId = organizationId 
      updateData.roleId = roleId 
  
      const isUser = await userModel.findOneAndUpdate(
        { _id:id },
        updateData,
        { new: true }
      );
  
      if (!isUser) {
        return res.status(404).json({ message: "نقش پیدا نشد" });
      }
  
      return res.status(200).json({message : "اطلاعات با موفقیت ویرایش شد"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};
exports.deleteInternal = async (req, res) => {
  try {
    const {id} = req.params
  
      const isRole = await userModel.findOneAndDelete({ _id:id });

      if (!isRole) {
        return res.status(404).json({ message: "کاربر پیدا نشد" });
      }
  
      return res.status(200).json({message : "کاربر با موفقیت حذف شد"});
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};


exports.registerExternal = async (req, res) => {
  try {
    const { name,username,email,phoneNumber,password } = req.body;


    const createUser = await userModel.create({
      name,username,email,phoneNumber,password,type : "external"
    });

    return res.status(201).json({message : "ثبت نام با موفقیت انجام شد"});
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.loginExternal = async (req, res) => {
  try {
    const { username , password } = req.body;
    const user = await userModel.findOne({ username });
    if (user) {
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (isValidPassword) {
        const accessToken = generateAccessTokenUserExternal(user._id,user.type);
        const updateUser = await userModel.findOneAndUpdate(
            { _id : user._id , username },
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
exports.getOneExternal = async (req, res) => {
  try {
    const findUser = await userModel.findOne({_id : req.userExternal._id,type : "external"})
    .select("-password -roleId -accessToken -admin ")
    .lean()
    return res.json(findUser)
    
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.updateExternal = async (req, res) => {
  try {
    const { name,username,email,phoneNumber,password } =req.body;
    const {id} = req.params
    
      const updateData = {};
      updateData.name = name
      updateData.username = username
      updateData.email = email
      updateData.phoneNumber = phoneNumber
  
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateData.password = hashedPassword;
      }
  
      const isUser = await userModel.findOneAndUpdate(
        { _id:id },
        updateData,
        { new: true }
      );
  
      if (!isUser) {
        return res.status(404).json({ message: "نقش پیدا نشد" });
      }
  
      return res.status(200).json({message : "اطلاعات با موفقیت ویرایش شد"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};


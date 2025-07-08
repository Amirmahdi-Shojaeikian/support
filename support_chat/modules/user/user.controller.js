const userModel = require("../../models/user");
const organozationModel = require("../../models/organization");
const {
  generateAccessTokenUserInternal,
  generateAccessTokenUserExternal
} = require("../../middlewares/token.auth");
const bcrypt = require("bcrypt");
const { logActivity } = require("../../utils/createActivity");


exports.loginIntenal = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });

    if (user) {
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (isValidPassword) {
        const accessToken = generateAccessTokenUserInternal(user._id, user.organizationId, user.type);
        const updateUser = await userModel.findOneAndUpdate(
          { username },
          { accessToken },
          {
            projection: { accessToken: 1, _id: 0 },
            returnDocument: "after",
          }
        );
        res.cookie("access_token", accessToken, { httpOnly: true });

        const findOrganization = await organozationModel.findOne({ _id: user.organizationId })

        await logActivity({
          userId: user._id,
          actionEn: 'login_user',
          actionFa: 'ورود کاربر ',
          targetType: 'user',
          targetId: user._id,
          details: {
            name: user.name,
            username: user.username,
            nameOrganization: findOrganization.name,
            OrganizationId: findOrganization._id
          }
        });
        return res
          .status(200)
          .json({ message: "ورود با موفقیت ", user: updateUser });
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
    const { name, username, email, phoneNumber, password, organizationId, roleId , departmentId } = req.body;


    const findUser = await userModel.findOne({ username, organizationId })
    if (findUser) {
      return res.status(400).json({ message: "نام کاربری تکراری است" })
    }

    const createUser = await userModel.create({ name, username, email, phoneNumber, type: "internal", password, organizationId,departmentId, roleId });

    const findOrganization = await organozationModel.findOne({ _id: organizationId })

    await logActivity({
      userId: req.userInternal._id,
      actionEn: 'create_user',
      actionFa: 'ایجاد کاربر ',
      targetType: 'user',
      targetId: createUser._id,
      details: {
        name: createUser.name,
        username: createUser.username,
        nameOrganization: findOrganization.name,
        OrganizationId: findOrganization._id
      }
    });

    return res.status(201).json({ message: "کاربر با موفقیت اضافه شد", user: createUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getAllInternal = async (req, res) => {
  try {
    const findUser = await userModel.find({ type: "internal", organizationId: req.userInternal.organizationId, admin: false })
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
    const { id } = req.params
    const findRole = await userModel.findOne({ _id: id })
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
    const { name, username, email, phonNumber, password, organizationId, roleId ,departmentId} = req.body;
    const { id } = req.params

    const updateData = {};
    updateData.name = name
    updateData.username = username
    updateData.email = email
    updateData.phonNumber = phonNumber
    updateData.phonNumber = phonNumber
    updateData.organizationId = organizationId
    updateData.roleId = roleId
    updateData.departmentId = departmentId
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    const isUser = await userModel.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );

    if (!isUser) {
      return res.status(404).json({ message: "نقش پیدا نشد" });
    }
    const findOrganization = await organozationModel.findOne({ _id: organizationId })

    await logActivity({
      userId: req.userInternal._id,
      actionEn: 'update_user',
      actionFa: 'آپدیت کاربر ',
      targetType: 'user',
      targetId: isUser._id,
      details: {
        name: isUser.name,
        username: isUser.username,
        nameOrganization: findOrganization.name,
        OrganizationId: findOrganization._id
      }
    });

    return res.status(200).json({ message: "اطلاعات با موفقیت ویرایش شد" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};
exports.deleteInternal = async (req, res) => {
  try {
    const { id } = req.params

    const isUser = await userModel.findOneAndDelete({ _id: id });

    if (!isUser) {
      return res.status(404).json({ message: "کاربر پیدا نشد" });
    }
    const findOrganization = await organozationModel.findOne({ _id: organizationId })

    await logActivity({
      userId: req.userInternal._id,
      actionEn: 'delete_user',
      actionFa: 'حذف کاربر ',
      targetType: 'user',
      targetId: isUser._id,
      details: {
        name: isUser.name,
        username: isUser.username,
        nameOrganization: findOrganization.name,
        OrganizationId: findOrganization._id
      }
    });
    return res.status(200).json({ message: "کاربر با موفقیت حذف شد" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};


exports.registerExternal = async (req, res) => {
  try {
    const { name, username, email, phoneNumber, password } = req.body;


    const createUser = await userModel.create({
      name, username, email, phoneNumber, password, type: "external"
    });

    return res.status(201).json({ message: "ثبت نام با موفقیت انجام شد" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.loginExternal = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (user) {
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (isValidPassword) {
        const accessToken = generateAccessTokenUserExternal(user._id, user.type);
        const updateUser = await userModel.findOneAndUpdate(
          { _id: user._id, username },
          { accessToken },
          {
            projection: { accessToken: 1, _id: 0 },
            returnDocument: "after",
          }
        );
        res.cookie("access_token", accessToken, { httpOnly: true });

        await logActivity({
          userId: user._id,
          actionEn: 'login_user_external',
          actionFa: 'ورود کاربر ',
          targetType: 'user',
          targetId: updateUser._id,
          details: {
            name: updateUser.name,
            username: updateUser.username,
          }
        });

        return res
          .status(200)
          .json({ message: "ورود با موفقیت ", user: updateUser });
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
    const findUser = await userModel.findOne({ _id: req.userExternal._id, type: "external" })
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
    const { name, username, email, phoneNumber, password } = req.body;
    const { id } = req.params

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
      { _id: id },
      updateData,
      { new: true }
    );

    if (!isUser) {
      return res.status(404).json({ message: "نقش پیدا نشد" });
    }


    await logActivity({
      userId: req.userInternal._id, 
      actionEn: 'update_user_external',
      actionFa: 'آپدیت کاربر ',
      targetType: 'user',
      targetId: isUser._id,
      details: {
        name: isUser.name,
        username: isUser.username,
      }
    });

    return res.status(200).json({ message: "اطلاعات با موفقیت ویرایش شد" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};


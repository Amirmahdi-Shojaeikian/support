const roleModel = require("../../models/role");
const organozationModel = require("../../models/organization");
const { logActivity } = require("../../utils/createActivity");


exports.add = async (req, res) => {
  try {
    const { name, routeAccessId } = req.body;

    const createrole = await roleModel.create({ name, routeAccessId, type: "admin" });

    await logActivity({
      userId: req.userAdmin._id,
      actionEn: 'create_roleAdmin',
      actionFa: 'ایجاد نقش ',
      targetType: 'Role',
      targetId: createrole._id,
      details: {
        name: createrole.name,
      }
    });
    return res.status(201).json({ message: "نقش با موفقیت اضافه شده", role: createrole });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getAll = async (req, res) => {
  try {
    const findRole = await roleModel.find({})
      .populate({
        path: "routeAccessId",
        select: "name path",
      })
      .lean()

    return res.json(findRole)

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params
    const findRole = await roleModel.findOne({ _id: id })
      .populate({
        path: "routeAccessId",
        select: "name path",
      })
      .lean()

    return res.json(findRole)

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.update = async (req, res) => {
  try {
    const { name, routeAccessId, type } = req.body;
    const { id } = req.params

    const updateData = {};
    updateData.name = name
    updateData.routeAccessId = routeAccessId
    updateData.type = type

    const isRole = await roleModel.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );

    if (!isRole) {
      return res.status(404).json({ message: "نقش پیدا نشد" });
    }

    await logActivity({
      userId: req.userAdmin._id,
      actionEn: 'update_roleAdmin',
      actionFa: 'آپدیت نقش ',
      targetType: 'Role',
      targetId: isRole._id,
      details: {
        name: isRole.name,
      }
    });

    return res.status(200).json({ message: "اطلاعات با موفقیت ویرایش شد" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};
exports.delete = async (req, res) => {
  try {
    const { id } = req.params

    const isRole = await roleModel.findOneAndDelete({ _id: id });

    if (!isRole) {
      return res.status(404).json({ message: "نقش پیدا نشد" });
    }

    await logActivity({
      userId: req.userAdmin._id,
      actionEn: 'delete_roleAdmin',
      actionFa: 'حذف نقش ',
      targetType: 'Role',
      targetId: isRole._id,
      details: {
        name: isRole.name,
      }
    });

    return res.status(200).json({ message: "نقش با موفقیت حذف شد" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};


exports.addInternal = async (req, res) => {
  try {
    const { name, routeAccessId } = req.body;

    const createrole = await roleModel.create({ name, routeAccessId, type: "others", organizationId: req.userInternal.organizationId });

    const findOrganization = await organozationModel.findOne({ _id: req.userInternal.organizationId })

    await logActivity({
      userId: req.userInternal._id,
      actionEn: 'create_role',
      actionFa: 'ایجاد نقش ',
      targetType: 'Role',
      targetId: createrole._id,
      details: {
        name: createrole.name,
        nameOrganization: findOrganization.name,
        OrganizationId: findOrganization._id
      }
    });

    return res.status(201).json({ message: "نقش با موفقیت اضافه شده", role: createrole });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getAllInternal = async (req, res) => {
  try {
    const findRole = await roleModel.find({ organizationId: req.userInternal.organizationId })
      .populate({
        path: "routeAccessId",
        select: "name path",
      })
      .lean()
    console.log(req.ip);

    return res.json(findRole)

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getOneInternal = async (req, res) => {
  try {
    const { id } = req.params
    const findRole = await roleModel.findOne({ _id: id, organizationId: req.userInternal.organizationId })
      .populate({
        path: "routeAccessId",
        select: "name path organizationId",
      })
      .lean()

    return res.json(findRole)

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.updateInternal = async (req, res) => {
  try {
    const { name, routeAccessId } = req.body;
    const { id } = req.params

    const updateData = {};
    updateData.name = name
    updateData.routeAccessId = routeAccessId
    updateData.type = "others"

    const isRole = await roleModel.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );

    if (!isRole) {
      return res.status(404).json({ message: "نقش پیدا نشد" });
    }

    const findOrganization = await organozationModel.findOne({ _id: req.userInternal.organizationId })

    await logActivity({
      userId: req.userInternal._id,
      actionEn: 'update_role',
      actionFa: 'آپدیت نقش ',
      targetType: 'Role',
      targetId: isRole._id,
      details: {
        name: isRole.name,
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

    const isRole = await roleModel.findOneAndDelete({ _id: id, organizationId: req.userInternal.organizationId });

    if (!isRole) {
      return res.status(404).json({ message: "نقش پیدا نشد" });
    }

    const findOrganization = await organozationModel.findOne({ _id: req.userInternal.organizationId })

    await logActivity({
      userId: req.userInternal._id,
      actionEn: 'delete_role',
      actionFa: 'حذف نقش ',
      targetType: 'Role',
      targetId: isRole._id,
      details: {
        name: isRole.name,
        nameOrganization: findOrganization.name,
        OrganizationId: findOrganization._id
      }
    });

    return res.status(200).json({ message: "نقش با موفقیت حذف شد" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};

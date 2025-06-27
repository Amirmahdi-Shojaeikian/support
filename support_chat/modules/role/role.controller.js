const roleModel = require("../../models/role");


exports.add = async (req, res) => {
  try {
    const { name,routeAccessId,type } =req.body;

    const createrole = await roleModel.create({name,routeAccessId,type});

    return res.status(201).json({message : "نقش با موفقیت اضافه شده", role : createrole});
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
    const {id} = req.params
    const findRouteAccess = await roleModel.findOne({_id : id})
    .populate({
      path: "routeAccessId",
      select: "name path",
    })
    .lean()

    return res.json(findRouteAccess)
    
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.update = async (req, res) => {
  try {
    const { name,routeAccessId,type } =req.body;
    const {id} = req.params
    
      const updateData = {};
      updateData.name = name
      updateData.routeAccessId = routeAccessId
      updateData.type = type
  
      const isRole = await roleModel.findOneAndUpdate(
        { _id:id },
        updateData,
        { new: true }
      );
  
      if (!isRole) {
        return res.status(404).json({ message: "نقش پیدا نشد" });
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
  
      const isRole = await roleModel.findOneAndDelete({ _id:id });

      if (!isRole) {
        return res.status(404).json({ message: "نقش پیدا نشد" });
      }
  
      return res.status(200).json({message : "نقش با موفقیت حذف شد"});
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};

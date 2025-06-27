const routeAccessModel = require("./../../models/routeAccess");


exports.add = async (req, res) => {
  try {
    const { name,path,type } =req.body;

    const createRouteAccess = await routeAccessModel.create({name,path,type});

    return res.status(201).json({message : "مسیر با موفقیت اضافه شده", route : createRouteAccess});
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getAll = async (req, res) => {
  try {
    const findRouteAccess = await routeAccessModel.find({}).lean()

    return res.json(findRouteAccess)
    
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getOne = async (req, res) => {
  try {
    const {id} = req.params
    const findRouteAccess = await routeAccessModel.findOne({_id : id}).lean()

    return res.json(findRouteAccess)
    
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.update = async (req, res) => {
  try {
    const { name,path,type } =req.body;
    const {id} = req.params
    
      const updateData = {};
      updateData.name = name
      updateData.path = path
      updateData.type = type
  
      const isRouteAccess = await routeAccessModel.findOneAndUpdate(
        { _id:id },
        updateData,
        { new: true }
      );
  
      if (!isRouteAccess) {
        return res.status(404).json({ message: "مسیر پیدا نشد" });
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
  
      const isRouteAccess = await routeAccessModel.findOneAndDelete({ _id:id });

      if (!isRouteAccess) {
        return res.status(404).json({ message: "مسیر پیدا نشد" });
      }
  
      return res.status(200).json({message : "مسیر با موفقیت حذف شد"});
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};

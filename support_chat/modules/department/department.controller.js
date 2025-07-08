const departmentModel = require("../../models/department");
const { logActivity } = require("../../utils/createActivity");

exports.add = async (req, res) => {
  try {
    const { name } =req.body;
    const createDepartment = await departmentModel.create({name,organizationId : req.userInternal.organizationId});


    await logActivity({
      userId: req.userInternal._id,
      actionEn: 'create_department',
      actionFa: 'ایجاد دپارتمان',
      targetType: 'Department',
      targetId: createDepartment._id,
      details: {
        name: createDepartment.name,
      }
    });

    return res.status(201).json({message : "دپارتمان با موفقیت اضافه شده", organization : createDepartment});
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getAll = async (req, res) => {
  try {
    const findDepartment = await departmentModel.find({organizationId : req.userInternal.organizationId}).lean()
    return res.json(findDepartment)
    
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getOne = async (req, res) => {
  try {
    const {id} = req.params
    const findDepartment = await departmentModel.findOne({_id : id, organizationId : req.userInternal.organizationId}).lean()

    return res.json(findDepartment)
    
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.update = async (req, res) => {
  try {
    const { name } =req.body;
    const {id} = req.params
    
      const updateData = {};
      updateData.name = name

      const isDepartment = await departmentModel.findOneAndUpdate(
        { _id:id , organizationId :req.userInternal.organizationId },
        updateData,
        { new: true }
      );
  
      if (!isDepartment) {
        return res.status(404).json({ message: "دپارتمان پیدا نشد" });
      }
  
      await logActivity({
        userId: req.userInternal._id,
        actionEn: 'update_department',
        actionFa: 'آپدیت دپارتمان',
        targetType: 'Department',
        targetId: isDepartment._id,
        details: {
          name: isDepartment.name,
        }
      });
      return res.status(200).json({message : "اطلاعات با موفقیت ویرایش شد"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};
exports.delete = async (req, res) => {
  try {
    const {id} = req.params
  
      const isDepartment = await departmentModel.findOneAndDelete({ _id:id });

      if (!isDepartment) {
        return res.status(404).json({ message: "دپارتمان پیدا نشد" });
      }
    
      await logActivity({
        userId: req.userInternal._id,
        actionEn: 'delete_department',
        actionFa: 'حذف دپارتمان',
        targetType: 'Department',
        targetId: isDepartment._id,
        details: {
          name: isDepartment.name,
        }
      });
      return res.status(200).json({message : "دپارتمان با موفقیت حذف شد"});
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};

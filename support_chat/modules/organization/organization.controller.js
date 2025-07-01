const organizationModel = require("../../models/organization");



function generateCustomId(length = 8) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
  }
  return result;
}

async function generateUniqueId() {
  let uniqueId;
  let isUnique = false;
  const maxAttempts = 10; 

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
      uniqueId = generateCustomId(8); 
      const existingCompany = await organizationModel.findOne({ uniqueId });
      if (!existingCompany) {
          isUnique = true;
          break;
      }
  }

  if (!isUnique) {
      throw new Error('Could not generate a unique ID after maximum attempts');
  }

  return uniqueId;
}


exports.add = async (req, res) => {
  try {
    const { name,country,city,email,phoneNumber,PostalCode,address } =req.body;
    const uniqueId = await generateUniqueId();
    const createOrganization = await organizationModel.create({name,uniqueId,country,city,email,phoneNumber,PostalCode,address});


    await logActivity({
      userId: req.userAdmin._id,
      actionEn: 'create_organization',
      actionFa: 'ایجاد سازمان',
      targetType: 'Organization',
      targetId: createOrganization._id,
      details: {
        name: createOrganization.name,
      }
    });

    return res.status(201).json({message : "سازمان با موفقیت اضافه شده", organization : createOrganization});
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getAll = async (req, res) => {
  try {
    const findOrganization = await organizationModel.find({}).lean()
    return res.json(findOrganization)
    
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getOne = async (req, res) => {
  try {
    const {id} = req.params
    const findOrganization = await organizationModel.findOne({_id : id}).lean()

    return res.json(findOrganization)
    
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.update = async (req, res) => {
  try {
    const { name,country,city,email,phoneNumber,PostalCode,address } =req.body;
    const {id} = req.params
    
      const updateData = {};
      updateData.name = name
      updateData.country = country
      updateData.city = city
      updateData.email = email
      updateData.phoneNumber = phoneNumber
      updateData.PostalCode = PostalCode
      updateData.address = address
  
      const isOrganization = await organizationModel.findOneAndUpdate(
        { _id:id },
        updateData,
        { new: true }
      );
  
      if (!isOrganization) {
        return res.status(404).json({ message: "سازمان پیدا نشد" });
      }
  
      await logActivity({
        userId: req.userAdmin._id,
        actionEn: 'update_organization',
        actionFa: 'آپدیت سازمان',
        targetType: 'Organization',
        targetId: isOrganization._id,
        details: {
          name: isOrganization.name,
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
  
      const isOrganization = await organizationModel.findOneAndDelete({ _id:id });

      if (!isOrganization) {
        return res.status(404).json({ message: "سازمان پیدا نشد" });
      }
    
      await logActivity({
        userId: req.userAdmin._id,
        actionEn: 'delete_organization',
        actionFa: 'حذف سازمان',
        targetType: 'Organization',
        targetId: isOrganization._id,
        details: {
          name: isOrganization.name,
        }
      });
      return res.status(200).json({message : "سازمان با موفقیت حذف شد"});
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });

  }
};

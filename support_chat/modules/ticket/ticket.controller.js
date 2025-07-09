const ticketModel = require("../../models/ticket");
const messageModel = require("../../models/messageTicket");
const { logActivity } = require("../../utils/createActivity");

exports.addExternal = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      departmentId,
      organizationId,
      message
    } = req.body;

    const newTicket = await ticketModel.create({
      title,
      description,
      status,
      priority,
      createdBy : req.userExternal._id,
      departmentId,
      organizationId
    });

    const newMsg = await messageModel.create({ message, ticketId: newTicket._id, userId: req.userExternal._id })

    await logActivity({
      userId: req.userExternal._id,
      actionEn: 'create_ticket_external',
      actionFa: 'ایجاد تیکت',
      targetType: 'Ticket',
      targetId: newTicket._id,
      details: {
        title: newTicket.title,
        organizationId: organizationId,
        departmentId: departmentId
      }
    });

    return res.status(201).json({ message: 'تیکت با موفقیت ایجاد شد', ticket: newTicket });
  } catch (error) {
    console.error('Create Ticket Error:', error);
    return res.status(500).json({ message: 'خطا در ایجاد تیکت', error: error.message });
  }
};
exports.getAllExternal = async (req, res) => {
  try {
    const findTicket = await ticketModel.find({ createdBy: req.userExternal._id }).lean()
    return res.json(findTicket)

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getOneExternal = async (req, res) => {
  try {
    const { id } = req.params
    const findTicket = await ticketModel.findOne({ _id: id, createdBy: req.userExternal._id }).lean()
    const findMsg = await messageModel.find({ ticketId: id })

    return res.json({ ticket: findTicket, messages: findMsg })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.updateExternal = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { status } = req.body;

    const updatedTicket = await ticketModel.findOneAndUpdate({_id :ticketId}, {status});

    
    if (!updatedTicket) {
      return res.status(404).json({ message: 'تیکت پیدا نشد' });
    }

    await logActivity({
      userId: req.userExternal._id,
      actionEn: 'update_ticket_external',
      actionFa: 'آپدیت تیکت',
      targetType: 'Ticket',
      targetId: updatedTicket._id,
      details: {
        title: updatedTicket.title,
        organizationId: updatedTicket.organizationId,
        departmentId: updatedTicket.departmentId
      }
    });

    return res.status(200).json({ message: 'تیکت با موفقیت ویرایش شد', ticket: updatedTicket });
  } catch (error) {
    console.error('Update Ticket Error:', error);
    return res.status(500).json({ message: 'خطا در ویرایش تیکت', error: error.message });
  }
};


// exports.delete = async (req, res) => {
//   try {
//     const {id} = req.params

//       const isDepartment = await ticketModel.findOneAndDelete({ _id:id });

//       if (!isDepartment) {
//         return res.status(404).json({ message: "دپارتمان پیدا نشد" });
//       }

//       await logActivity({
//         userId: req.userInternal._id,
//         actionEn: 'delete_department',
//         actionFa: 'حذف دپارتمان',
//         targetType: 'Department',
//         targetId: isDepartment._id,
//         details: {
//           name: isDepartment.name,
//         }
//       });
//       return res.status(200).json({message : "دپارتمان با موفقیت حذف شد"});

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "خطای سرور" });

//   }
// };


exports.acceptInternal = async (req, res) => {
  try {
    
    const ticketId = req.params.id;
    const supporterId = req.userInternal._id;


    const ticket = await ticketModel.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'تیکت پیدا نشد' });
    }

    const alreadyAssigned = ticket.assignedTo.some(id => id.toString() === supporterId.toString());

    if (!alreadyAssigned) {
      ticket.assignedTo.push(supporterId);

      ticket.status = 'in_progress';

      await ticket.save();

      await logActivity({
        userId: req.userInternal._id,
        actionEn: 'accept_ticket_internal',
        actionFa: 'پذیرش تیکت',
        targetType: 'Ticket',
        targetId: ticket._id,
        details: {
          title: ticket.title,
          organizationId: ticket.organizationId,
          departmentId: ticket.departmentId
        }
      });
      return res.status(200).json({ message: 'تیکت با موفقیت به شما اختصاص یافت', ticket });
    } else {
      return res.status(200).json({ message: 'شما قبلاً به این تیکت اختصاص یافته‌اید', ticket });
    }

  } catch (error) {
    console.error('Accept Ticket Error:', error);
    return res.status(500).json({ message: 'خطا در پذیرش تیکت', error: error.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const unassignedTickets = await ticketModel.find({
      assignedTo: { $eq: [] }
    })
    .populate({
      path: "createdBy",
      select: "name ",
    })
    .populate({
      path: "organizationId",
      select: "name ",
    })
    .populate({
      path: "departmentId",
      select: "name ",
    })

    return res.status(200).json({
      message: 'تیکت‌های بدون پشتیبان',
      tickets: unassignedTickets
    });

  } catch (error) {
    console.error('Get Unassigned Tickets Error:', error);
    return res.status(500).json({
      message: 'خطا در دریافت تیکت‌های بدون پشتیبان',
      error: error.message
    });
  }
};
exports.getAllIntenal = async (req, res) => {
  try {
    const { status } = req.query
    if (status === undefined) {
      const findTicket = await ticketModel.find
      ({
        assignedTo: [req.userInternal._id],
        organizationId: req.userInternal.organizationId,
        departmentId: req.userInternal.departmentId,
        
      })      
      .lean()
      return res.json(findTicket)

    }
    const findTicket = await ticketModel.find
      ({
        assignedTo: [req.userInternal._id],
        organizationId: req.userInternal.organizationId,
        departmentId: req.userInternal.departmentId,
        status
      })      
      .lean()

    return res.json(findTicket)

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.getOneIntenal = async (req, res) => {
  try {
    const { id } = req.params
    const findTicket = await ticketModel.findOne
      ({
        _id: id,
        assignedTo: req.userInternal._id,
        organizationId: req.userInternal.organizationId,
        departmentId: req.userInternal.departmentId
      }).lean()
    const findMsg = await messageModel.find({ ticketId: id })


    return res.json({ ticket: findTicket, messages: findMsg })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "خطای سرور" });
  }
};
exports.updateIntenal = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { description, status, assignedTo } = req.body;
    const supporterId = req.userInternal._id;
    console.log(supporterId);
    

    const ticket = await ticketModel.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'تیکت پیدا نشد' });
    }

    if (description !== undefined) ticket.description = description;
    if (status !== undefined) ticket.status = status;

    // ست کردن مستقیم assignedTo (با حذف همه آی‌دی‌های قبلی)
    if (assignedTo !== undefined) {
      if (Array.isArray(assignedTo)) {
        ticket.assignedTo = assignedTo;
      } else {
        ticket.assignedTo = [assignedTo];
      }
    }

    // اطمینان از اینکه پشتیبان فعلی هم داخل لیست هست
    if (!ticket.assignedTo.some(id => id.toString() === supporterId.toString())) {
      ticket.assignedTo.push(supporterId);
    }

    const updatedTicket = await ticket.save();

    await logActivity({
      userId: req.userInternal._id,
      actionEn: 'update_ticket_internal',
      actionFa: 'اپدیت تیکت',
      targetType: 'Ticket',
      targetId: updatedTicket._id,
      details: {
        title: updatedTicket.title,
        organizationId: updatedTicket.organizationId,
        departmentId: updatedTicket.departmentId,
        assignedTo: updatedTicket.assignedTo
      }
    });

    return res.status(200).json({
      message: 'تیکت با موفقیت ویرایش شد ',
      ticket: updatedTicket
    });

  } catch (error) {
    console.error('Update Ticket Error:', error);
    return res.status(500).json({ message: 'خطا در ویرایش تیکت', error: error.message });
  }
};


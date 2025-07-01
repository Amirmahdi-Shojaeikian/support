const activityModel = require('../models/activity');


const logActivity = async ({
    userId,
    actionEn,
    actionFa,
    targetType,
    targetId = null,
    details = {},
    ipAddress = '',
    userAgent = ''
}) => {
    try {
        await activityModel.create({
            userId,
            actionEn,
            actionFa,
            targetType,
            targetId,
            details,
            ipAddress,
            userAgent
        });
    } catch (error) {
        console.error('خطا در ثبت فعالیت', error.message);
    }
};

module.exports = { logActivity };

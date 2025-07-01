const jwt = require("jsonwebtoken")
require("dotenv").config()

const generateAccessToken =  (_id) => {
    const accessToken =  jwt.sign({_id},process.env.JWT_SECRET,{
        expiresIn : "4h"
    })
    return accessToken
}
const generateAccessTokenUserInternal =  (_id,organizationId,type) => {
    const accessToken =  jwt.sign({_id,organizationId,type},process.env.JWT_SECRET,{
        expiresIn : "4h"
    })
    return accessToken
}
const generateAccessTokenUserExternal =  (_id,type) => {
    const accessToken =  jwt.sign({_id,type},process.env.JWT_SECRET,{
        expiresIn : "4h"
    })
    return accessToken
}

const generateRefreshToken =  (_id) => {
    const refreshToken =  jwt.sign({_id},process.env.JWT_REFRESH_SECRET,{
        expiresIn : "4h"
    })
    return refreshToken
}
module.exports = {
    generateAccessToken,
    generateAccessTokenUserInternal,
    generateAccessTokenUserExternal,
    generateRefreshToken
}
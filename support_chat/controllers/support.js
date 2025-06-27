const supportModel = require("./../models/support");
const bcrypt = require("bcrypt");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/token.auth");

exports.register = async (req, res) => {
  try {
    const { firstName,
      lastName,
      username,
      password } =
      req.body;

    const firsUser = (await supportModel.countDocuments()) === 0;
    let role = "USER";
    if (firsUser) {
      role = "ADMIN";
    }
    const user = await supportModel.create({
      firstName,
      lastName,
      username,
      password
    });

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.json({ error: error });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await supportModel.findOne({ username });
    if (user) {
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (isValidPassword) {
        const accessToken = generateAccessToken(user._id);
        const updateUser = await supportModel.findOneAndUpdate(
          { username },
          {
            // $set: { accessToken },
            accessToken
          },
          {
            projection: { password: 0 },
            returnOriginal: false,
          }
        );
        res.cookie("access_token", accessToken, { httpOnly: true });

        return res
          .status(200)
          .json({ message: "login successfully ", updateUser });
      }
      return res.status(401).json({ message: "passwords do not match" });
    }
    return res.status(404).json({ message: "user not found" });
  } catch (error) {
    console.log(error);
    return res.json({ error: error });
  }
};



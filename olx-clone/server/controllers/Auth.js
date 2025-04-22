const UserServices = require("../services/Auth");
const userServices = new UserServices();

class userController {
  createUser = async (req, res) => {
    const { email, password, firstName, lastName } = await req.body;

    try {
      const newUserAccessKey = await userServices.createAccount({
        email,
        password,
        firstName,
        lastName,
      });
      if (newUserAccessKey.Error) {
        throw new Error(newUserAccessKey.Error);
      } else {
        return res.json({ accessToken: newUserAccessKey });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
    }
  };

  loginUser = async (req, res) => {
    const { email, password } = await req.body;
    try {
      const userAccessKey = await userServices.login({ email, password });
      if (userAccessKey.Error) {
        throw new Error(userAccessKey.Error);
      } else {
        return res.json({ accessToken: userAccessKey });
      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  // authenticateCurUser = async (req, res) => {
  //   try {
  //     if (req.user === undefined) {
  //       throw new Error("Token error");
  //     }
  //     const curUser = await userServices.authenticate(req.user.email);
  //     if (curUser.Error === "An error occured!") {
  //       throw new Error("An error occured!");
  //     }
  //     return res.json(curUser);
  //   } catch (err) {
  //     return res.status(500).json(err.message);
  //   }
  // };
}

module.exports = userController;

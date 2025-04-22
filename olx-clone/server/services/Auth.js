// require("dotenv").config();

const { User } = require("../models");
const bcrypt = require("bcrypt");
const genrateAccessToken = require("../common/generateToken");

class UserServices {
  createAccount = async (data) => {
    const { email, password, firstName, lastName } = data;

    try {
      const Users = await User.findAll();
      const curUser = await Users.find((user) => user.email === email);
      if (curUser) {
        throw new Error("Email already exist!");
      } else {
        // const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, 10);
        const createUser = await User.create({
          email,
          password: hashedPassword,
          firstName,
          lastName,
        });

        const user = {
          userId: createUser.id,
          email: createUser.email,
          password: createUser.password,
          firstName,
          lastName,
        };

        const accessToken = genrateAccessToken(user);

        return accessToken;
      }
    } catch (err) {
      console.log(err);
      return { Error: err.message };
    }
  };

  login = async (data) => {
    const { email, password } = data;
    try {
      const users = await User.findAll();
      const curUser = users.find((user) => user.email === email);
      const authUser = curUser
        ? await bcrypt.compare(password, curUser.password)
        : false;

      if (authUser && curUser) {
        const accessToken = genrateAccessToken({
          email: curUser.email,
          password: curUser.password,
          firstName: curUser.firstName,
          lastName: curUser.lastName,
        });

        return accessToken;
      } else if (!authUser && curUser) {
        throw new Error("Email or password might be incorrect!");
      } else {
        throw new Error("Email or password might be incorrect!");
      }
    } catch (err) {
      return { Error: err.message };
    }
  };

  //   authenticate = async (email) => {
  //     try {
  //       const curUser = await User.findOne({ where: { email } });
  //       // const curUser = users.filter((user) => user.email === email);
  //       return curUser;
  //     } catch (err) {
  //       return { Error: "An error occured!" };
  //     }
  //   };
}

module.exports = UserServices;

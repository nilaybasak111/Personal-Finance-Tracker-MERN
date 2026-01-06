import User from "../Schema/UserSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const authController = {
  // User SignUp Logic
  /* Request Body -
    {
      "name": "Nilay Basak",
      "email": "nilaybasak@gmail.com",
      "password": "123456"
    }
  */

  signUp: async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User Already Exists" });
    } else {
      // Generating Salt & Hashing The Password
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);

      const newUser = new User({ name, email, password: hashPassword });
      //console.log("this is newuser2 login ", newUser.id)

      // Generating JWT & Returning to the User
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      //console.log("token in signup ", token);

      await newUser.save();
      res
        .status(200)
        .json({ message: "User Created Successfully", jwt: token });
    }
  }
};

export default authController;

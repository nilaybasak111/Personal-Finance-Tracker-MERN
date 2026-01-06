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
    try {
      const user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ message: "User Already Exists" });
      } else {
        // Generating Salt & Hashing The Password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({ name, email, password: hashPassword });
        //console.log("this is newuser login ", newUser._id)

        await newUser.save();

        // Generating JWT & Returning to the User
        const token = jwt.sign(
          { id: newUser._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1d",
          }
        );
        console.log("token in signup ", token);
        res.status(201).json({
          message: "User Created Successfully",
          jwt: token,
          user: { id: newUser._id, name: newUser.name, email: newUser.email },
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  },

  // User LogIn Logic
  /* Request Body -
    {
      "email": "nilaybasak@gmail.com",
      "password": "123456"
    }
  */

  logIn: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      //console.log("user in login ", user);
      if (!user) {
        return res.status(401).json({ message: "Please Create an Account" });
      }

      // Comparing Password with Hashed Password
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // Generating JWT & Returning to the User
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d",
        });
        res.status(200).json({ message: "Login Successfull", jwt: token });
      } else {
        res.status(401).json({ message: "Invalid Password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  },
};

export default authController;

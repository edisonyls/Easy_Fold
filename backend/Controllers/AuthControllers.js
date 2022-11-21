const UserSchema = require("../Models/SignUpModels");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "fhmfBYFfKZFhMNapIk2z", {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { emailAddress: "", password: "" };

  if (err.message === "incorrect email address") {
    errors.email = "Email is not registered!";
  } else if (err.message === "incorrect password") {
    errors.email = "Incorrect Password!";
  }

  if (err.code === 11000) {
    errors.emailAddress = "Email is already registered";
    errors.password = "User Password";
    return errors;
  }
  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    return errors;
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { fullName, emailAddress, password } = req.body;
    const user = await UserSchema.create({
      fullName,
      emailAddress,
      password,
    });
    const token = createToken(user._id);

    res.cookie("user", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });
    res.status(201).json({ user: user._id, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { emailAddress, password } = req.body;
    const user = await UserSchema.login(emailAddress, password);
    const token = createToken(user._id);
    res.cookie("user", token, {
      httpOnly: false,
      maxAge: maxAge * 1000,
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

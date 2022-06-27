const user_Router = require("express").Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate_User } = require("../models/users");
const auth = require("../middleware/auth");

user_Router.get("/me", auth, async (req, res) => {
  // res.json(req.user);
  const user = await User.findById(req.user._id).select("-password");
  res.json(user); //security issue - will print the password if not removed
});

user_Router.post("/", async (req, res) => {
  const err = validate_User(req.body).error;
  if (err)
    return res.status(400).json({ error: err.details.map((d) => d.message) });

  //check if the user already exists
  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(400).json({ message: "Email already exists" });

  user = new User(req.body);
  //before saving the user, we need to encrypt the password
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();
  res.status(201).json(_.pick(user, ["name", "email", "biz", "_id"]));
});

module.exports = user_Router;

// new User({
//   name: req.body.name,
//   email: req.body.email,
//   password: req.body.password,
//   biz: req.body.biz,
// });
// .save()
// .then((doc) => res.json(doc))
// .catch((e) => {
//   if (e.keyValue.email) {
//     return res.status(400).json("Email already exists");
//   }
//   res.json({ error: e });
// });

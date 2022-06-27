const Joi = require("joi");
const bcrypt = require("bcrypt");
const auth_Router = require("express").Router();
const { User } = require("../models/users");

const auth_Schema = Joi.object({
  email: Joi.string().email().max(64).required(),
  password: Joi.string().min(6).max(64).required(),
});

const validate_Auth = (body) => auth_Schema.validate(body);
//POST /api/auth
//BODY: { email, password }

auth_Router.post("/", async (req, res) => {
  const { error } = validate_Auth(req.body);
  if (error) return res.json({ message: error.details.map((d) => d.message) });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ message: `invalid email or password` });

  //password validation
  const valid_Password = await bcrypt.compare(req.body.password, user.password);
  if (!valid_Password)
    return res.status(400).json({ message: `invalid email or password` });

  res.json({ token: user.generateToken() });
});

module.exports = auth_Router;

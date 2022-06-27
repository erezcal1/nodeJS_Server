const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

//https://mongoosejs.com/docs/validation.html
//schema help us to define the structure of the data
const user_Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    minlength: 6,
    maxlength: 64,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 1024, //encrypted password takes more space
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  biz: {
    type: Boolean,
    required: true,
  },
});

//add methods to User schema (not arrow function since we need to access this)
user_Schema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_SECRET
  );
  return token;
};

const schema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().min(6).max(64).required().email(),
  password: Joi.string().min(6).max(255).required(), //encryption happens after the first validation
  biz: Joi.boolean().required(),
});

function validate_User(user) {
  return schema.validate(user, { abortEarly: false });
}
const User = mongoose.model("User", user_Schema);

module.exports = { User, validate_User };

//mongoose will help us to create a class

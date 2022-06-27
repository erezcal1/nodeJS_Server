const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");

const card_Schema = new mongoose.Schema({
  biz_Name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  biz_Description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  biz_Address: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 500,
  },
  biz_Phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 11,
  },
  biz_Image: {
    type: String,
    required: true,
    minlength: 12,
    maxlength: 1024,
  },
  biz_Number: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 9_999_999_999,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Card = mongoose.model("Card", card_Schema);

const card_Joi_Schema = Joi.object({
  biz_Name: Joi.string().min(2).max(255).required(),
  biz_Description: Joi.string().min(2).max(1024).required(),
  biz_Address: Joi.string().min(2).max(500).required(),
  biz_Phone: Joi.string()
    .min(9)
    .max(11)
    .required()
    .regex(/^0[2-9][-]?\d{7,9}$|^05[0-9][-]?\d{7,9}$|^07[3,7][-]?\d{7,9}$/),
});

const generate_Biz_Number = async () => {
  while (true) {
    let random_Number = _.random(100, 9_999_999_999);
    let card = await Card.findOne({ biz_Number: random_Number });
    if (!card) return String(random_Number); //`${random_Number}`
  }
};

const validate_Card = (card) =>
  card_Joi_Schema.validate(card, { abortEarly: false });

module.exports = { Card, validate_Card, generate_Biz_Number };

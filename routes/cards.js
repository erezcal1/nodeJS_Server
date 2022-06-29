const cards_Router = require("express").Router();
const _ = require("lodash");
const auth = require("../middleware/auth");
const { Card, validate_Card, generate_Biz_Number } = require("../models/cards");

cards_Router.post("/", auth, async (req, res) => {
  const { error } = validate_Card(req.body);
  if (error)
    return res.status(400).json({ error: error.details.map((d) => d.message) });

  let card = new Card({
    biz_Number: await generate_Biz_Number(),
    biz_Image:
      req.body.biz_Image ??
      `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png`,
    user_id: req.user._id,
    ...req.body,
  });
  card = await card.save();
  res.json(card);
});

cards_Router.get("/", auth, async (req, res) => {
  console.log("request", req.user);
  const cards = await Card.find({ user_id: req.user._id });
  res.json(cards);
});


module.exports = cards_Router;

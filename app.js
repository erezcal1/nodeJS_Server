require("dotenv").config(); //reads all the environment variables from .env file
const express = require("express");
const cors = require("cors")
const morgan = require("morgan");
const connect = require("./utils/connect-db");
const user_Router = require("./routes/users");
const auth_Router = require("./routes/auth");
const cards_Router = require("./routes/cards");

connect()
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));

const app = express();
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //parses body that contains json
app.use(cors());

app.use("/api/users", user_Router);
app.use("/api/auth", auth_Router);
app.use("/api/cards", cards_Router);
app.get("/myapi", (req,res)=>{
  res.json({message:"ok"});
})

const PORT = process.env.EXPRESS_PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

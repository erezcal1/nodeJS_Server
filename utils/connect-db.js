const mongoose = require("mongoose");

const connection_Options = {
  username: process.env.MONGO_USER || "",
  password: process.env.MONGO_PASS || "",
  host: process.env.MONGO_HOST || "",
  db: process.env.MONGO_DB || "",
};

//the function get an object and destructured it to get the values
const creat_URI = ({ username, password, host, db }) => {
  return `mongodb+srv://${username}:${password}@${host}/${db}?retryWrites=true&w=majority`;
};

const connect = (options = connection_Options) => {
  const uri = creat_URI(options);
  return mongoose.connect(uri);
};

module.exports = connect;

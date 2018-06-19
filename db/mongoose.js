const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);
// mongoose.connection.once("connect", () => console.log("Database connected."));

module.exports = { mongoose };
const mongoose = require("mongoose")

const Client = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
})

module.exports = mongoose.model("client", Client)

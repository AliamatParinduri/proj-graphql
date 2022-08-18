const mongoose = require("mongoose")

const Project = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "client",
  },
})

module.exports = mongoose.model("project", Project)

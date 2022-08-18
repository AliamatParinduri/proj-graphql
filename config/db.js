const mongoose = require("mongoose")
const colors = require("colors")

const connectDB = async () => {
  const conn = await mongoose
    .connect(process.env.MONGO_URI)
    .then((e) => e.connection.host)

  console.log(`mongo db connect: ${conn}`.cyan.underline.bold)
}

module.exports = connectDB

require("dotenv").config()
const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

// console.log("Connecting to", url)

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message)
  })

const phoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must provide name"],
    index: true,
    unique: true,
    minlength: [3, "Minimum 3 characters"],
  },
  number: {
    type: String,
    required: true,
    index: true,
    unique: true,
    minlength: 8,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{3,}$/.test(v)
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Format: DD-D... or DDD-D...`,
    },
  },
})

phoneSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Phone", phoneSchema)

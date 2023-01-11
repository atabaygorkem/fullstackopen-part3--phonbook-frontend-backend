//This is a side quest. It is not affecting the rest of project.
const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("Provide password! Correct format: node mongo.js <password>")
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://mongouser:${password}@cluster0.yvstagd.mongodb.net/fsoTempPhonebookDB?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", noteSchema)

const person = new Person({
  name: `${name}`,
  number: `${number}`,
})

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:")
    result.forEach((phone) => {
      console.log(phone)
    })
    mongoose.connection.close()
  })
} else {
  person.save().then(() => {
    console.log(`added ${name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}

const { urlencoded, response } = require("express")
const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const Phone = require("./models/phone.js")

app.use(express.json())
// app.use(express.urlencoded({extended:true}))
app.use(cors())

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method)
//   console.log("Path:  ", request.path)
//   console.log("Body:  ", request.body)
//   console.log("---")
//   next()
// }

//Create custom token to log request body object that is created by express.json (body-parser)
morgan.token("reqBody", (req, res) => JSON.stringify(req.body))
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqBody"
  )
)

// let persons = [
//   {
//     "id": 1,
//     "name": "Arto Hellas",
//     "number": "040-123456"
//   },
//   {
//     "id": 2,
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523"
//   },
//   {
//     "id": 3,
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": 4,
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ]
app.use(express.static("build"))

//ROUTES
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>")
})

app.get("/info", (request, response, next) => {
  Phone.countDocuments({})
    .then((count) =>
      response.send(
        `Phonebook has info for ${count} people <br/> ${new Date()}`
      )
    )
    .catch((err) => next(err))
})

app.get("/api/persons", (request, response, next) => {
  // response.json(persons)
  Phone.find({})
    .then((result) => response.json(result))
    .catch((err) => next(err))
})

app.get("/api/persons/:id", (request, response) => {
  Phone.findById(request.params.id)
    .then((result) => response.json(result))
    .catch((error) =>
      response.status(400).json({
        error: "Content missing",
      })
    )

  // const id = +request.params.id //+ for makin it number
  // const person = persons.find(p => p.id === id)
  // if (person) {
  //     response.json(person)
  //   } else {
  //     response.status(404).end()
  //   }
})

// const generateId = () => {
//     const maxId = persons.length > 0
//       ? Math.max(...persons.map(p => p.id))
//       : 0
//     return maxId + 1
// }

app.post("/api/persons", (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Content missing",
    })
  }

  new Phone({
    name: body.name,
    number: body.number,
  })
    .save()
    .then((result) => response.json(result))
    .catch((err) => next(err))

  //Check if name already exist
  // if (persons.map(p => p.name).includes(body.name)) {
  //   return response.status(400).json({
  //      error: 'name must be unique'
  //   })
  // }

  // const person = {
  //   name: body.name,
  //   number: body.number || 0,
  //   id: generateId(),
  // }
  // persons = [...persons, person]
})

app.put("/api/persons/:id", (req, res, next) => {
  const phone = {
    number: req.body.number,
  }
  //All top level update keys(phone paramater) which are not atomic operation names are treated as set operations
  Phone.findByIdAndUpdate(req.params.id, phone, {
    new: true,
    runValidators: true,
  })
    .then((updatedPhone) => res.json(updatedPhone))
    .catch((err) => next(err))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Phone.findByIdAndRemove(request.params.id)
    .then((result) => response.status(204).end())
    .catch((err) => next(err))
  // const id = +request.params.id
  // persons = persons.filter(p => p.id !== id)

  // response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  }
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

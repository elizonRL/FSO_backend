require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const personDB = require("./models/dataBase");

const app = express();
app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());
app.use(express.static("dist"));

const generateId = () => {
  const randomId = Math.floor(Math.random() * 1000) + 1;
  return randomId;
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/persons", (req, res) => {
  personDB.find({}).then((Persons) => res.json(Persons));
});

app.get("/api/persons/:id", (req, res, next) => {
  personDB
    .findById(req.params.id)
    .then((person) => res.json(person))
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  personDB
    .findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  const person = new personDB({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});
app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  personDB
    .findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: "query" }
    )
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `Phonebook has info for ${
      Persons.length
    } people <br> ${date} <br> Id Random ${generateId()}`
  );
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
/* mongodb+srv://<username>:<password>@cluster0.aowtp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 */
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

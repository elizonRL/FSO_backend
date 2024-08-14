const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config;

const datbase = require("./dataBase");


const app = express();
app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());
app.use(express.static("dist"));


let Persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
const generateId = () => {
  const randomId = Math.floor(Math.random() * 1000) + 1;
  return randomId;
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/persons", (req, res) => {
  res.json(Persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = Persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  Persons = Persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }
  if (
    Persons.find(
      (person) =>
        person.name.toLocaleLowerCase() === body.name.toLocaleLowerCase()
    )
  ) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  Persons = Persons.concat(person);
  res.json(person);
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `Phonebook has info for ${
      Persons.length
    } people <br> ${date} <br> Id Random ${generateId()}`
  );
});

const PORT = process.env.PORT || 3001;
/* mongodb+srv://<username>:<password>@cluster0.aowtp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

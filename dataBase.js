const mongoose = require("mongoose");

const password = process.argv[2];
console.log(password);
const url = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(url).then(console.log("connected to MongoDB"));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Person = mongoose.model("Person", personSchema);

module.exports = Person;

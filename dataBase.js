const mongoose = require('mongoose')

const password = process.argv[2];
console.log(password);
const url =`mongodb+srv://fullstack:${password}@cluster0.aowtp.mongodb.net/phone?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url).then(
  console.log("connected to MongoDB")
);
const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit();
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.uujki.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

/*  Code used when passing three command-line arguments

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

person.save().then((result) => {
  console.log(
    `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
  );
  mongoose.connection.close();
});
 */

// Code used when the password is the only comand-line arg
const person = new Person({
  name: "Morty Smith",
  number: "C-137",
});

person.save().then((result) => {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((per) => {
      console.log(per.name, per.number);
    });
    mongoose.connection.close();
  });
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/persons");

const app = express();

// Morgan config
morgan.token("dataBody", (req, res) => {
	const { body } = req;
	return JSON.stringify(body);
});

// Middleware of unknown endpoint
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

// Error handler middleware
const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}
	next(error);
};

app.use(express.json());
app.use(cors());
app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :dataBody"
	)
);
app.use(express.static("build"));

// Get all
app.get("/api/persons", (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

// Info
app.get("/info", (request, response) => {
	const date = new Date();
	Person.countDocuments({}, (error, count) => {
		response.send(
			`<p>Phonebook has info for ${count} people</p>  <p>${date}</p>`
		);
	});
});

// Single Phonebook entry
app.get("/api/persons/:id", (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

// Delete
app.delete("/api/persons/:id", (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

// Post
app.post("/api/persons", (request, response, next) => {
	const { body } = request;

	if (body.name === undefined) {
		return response.status(400).json({
			error: "Name missing",
		});
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => {
			response.json(savedPerson);
		})
		.catch((error) => next(error));
});

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

// handler of requests with result to errors
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

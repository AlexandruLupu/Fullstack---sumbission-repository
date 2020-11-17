const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

// Get all
/* notesRouter.get("/", (request, response) => {
	Note.find({}).then((notes) => {
		response.json(notes);
	});
});
 */
notesRouter.get("/", async (request, response) => {
	const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
	response.json(notes);
});

// GET :id
/* notesRouter.get("/:id", (request, response, next) => {
	Note.findById(request.params.id)
		.then((note) => {
			if (note) {
				response.json(note);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
}); */

// Adding express-async-errors eliminates the need fore try-catch blocks !!!!!!!!
/* notesRouter.get("/:id", async (request, response, next) => {
	try {
		const note = await Note.findById(request.params.id);
		if (note) {
			response.json(note);
		} else {
			response.status(404).end();
		}
	} catch (exception) {
		next(exception);
	}
});
 */

notesRouter.get("/:id", async (request, response) => {
	const note = await Note.findById(request.params.id);
	if (note) {
		response.json(note);
	} else {
		response.status(404).end();
	}
});

// POST
/* notesRouter.post("/", (request, response, next) => {
	const body = request.body;

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	});

	note
		.save()
		.then((savedNote) => {
			response.json(savedNote);
		})
		.catch((error) => next(error));
}); */

// Adding express-async-errors eliminates the need fore try-catch blocks !!!!!!!!
/* notesRouter.post("/", async (request, response, next) => {
	const body = request.body;

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	});

	try {
		const savedNote = await note.save();
		response.json(savedNote);
	} catch (exception) {
		next(exception);
	}
});
 */

const getTokenFrom = (request) => {
	const authorization = request.get("authorization");
	if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
		return authorization.substring(7);
	}
	return null;
};

notesRouter.post("/", async (request, response) => {
	const body = request.body;
	const token = getTokenFrom(request);
	const decodedToken = jwt.verify(token, config.SECRET);

	if (!token || !decodedToken) {
		return response.status(401).json({ error: "token missing or invalid" });
	}

	// Change body.userId to decodedToken.id - I don't send the user Id in the Front End form
	const user = await User.findById(decodedToken.id);

	const note = new Note({
		content: body.content,
		important: body.important === undefined ? false : body.important,
		date: new Date(),
		user: decodedToken.id,
	});

	const savedNote = await note.save();
	user.notes = user.notes.concat(savedNote._id);
	await user.save();

	response.json(savedNote);
});

// DELETE
/* notesRouter.delete("/:id", (request, response, next) => {
	Note.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch((error) => next(error));
}); */

// Adding express-async-errors eliminates the need fore try-catch blocks !!!!!!!!
/* notesRouter.delete("/:id", async (request, response, next) => {
	try {
		await Note.findByIdAndRemove(request.params.id);
		response.status(204).end();
	} catch (exception) {
		next(exception);
	}
});
 */

notesRouter.delete("/:id", async (request, response) => {
	await Note.findByIdAndRemove(request.params.id);
	response.status(204).end();
});

// PUT
notesRouter.put("/:id", (request, response, next) => {
	const body = request.body;

	const note = {
		content: body.content,
		important: body.important,
	};

	Note.findByIdAndUpdate(request.params.id, note, { new: true })
		.then((updatedNote) => {
			response.json(updatedNote);
		})
		.catch((error) => next(error));
});

module.exports = notesRouter;

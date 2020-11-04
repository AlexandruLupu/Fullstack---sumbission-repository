const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

// Get all
blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", {
		username: 1,
		name: 1,
		id: 1,
	});
	response.json(blogs);
});

// Get one
blogsRouter.get("/:id", async (request, response) => {
	const blog = await Blog.findById(request.params.id);
	if (blog) {
		response.json(blog);
	} else {
		response.status(204).end();
	}
});

// Post

/* const getTokenFrom = (request) => {
	const authorization = request.get("authorization");
	if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
		return authorization.substring(7);
	}
	return null;
};
 */
blogsRouter.post("/", async (request, response, next) => {
	const body = request.body;
	const token = request.token;

	const decodedToken = jwt.verify(token, config.SECRET);

	console.log("Decoded Token: ", decodedToken);

	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: "token missing or invalid" });
	}
	const user = await User.findById(body.userId);

	const blog = new Blog({
		title: body.title,
		author: body.author,
		likes: body.likes || 0,
		user: user._id,
	});

	try {
		const savedBlog = await blog.save();
		user.blogs = user.blogs.concat(savedBlog._id);
		await user.save();
		response.status(201).json(savedBlog);
	} catch (exception) {
		next(exception);
	}
});

// Delete
blogsRouter.delete("/:id", async (request, response) => {
	const token = request.token;
	const decodedToken = jwt.verify(token, config.SECRET);

	const blog = await Blog.findById(request.params.id);
	const user = await User.findById(decodedToken.id);

	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: "token missing or invalid" });
	}

	if (!(blog.user.toString() === user._id.toString())) {
		return response
			.status(401)
			.json({ error: "The blog can be deleted only by the owner" });
	} else {
		await Blog.findByIdAndRemove(request.params.id);

		response.status(204).end();
	}
});

// Put
/* blogsRouter.put("/:id", (request, response, next) => {
	const body = request.body;

	const blog = {
		likes: body.likes,
	};

	Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
		.then((updatedBlog) => {
			response.json(updatedBlog);
		})
		.catch((error) => next(error));
}); */

blogsRouter.put("/:id", async (request, response) => {
	const body = request.body;

	const blog = {
		likes: body.likes,
	};

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true,
	});
	response.json(updatedBlog);
});

module.exports = blogsRouter;

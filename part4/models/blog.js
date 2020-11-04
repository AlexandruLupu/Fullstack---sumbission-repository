const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	author: {
		type: String,
		required: true,
	},
	url: String,
	likes: Number,
	blog_id: mongoose.ObjectId,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

blogSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		returnedObject.url = `/api/blogs/${returnedObject.id}`;
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Blog", blogSchema);

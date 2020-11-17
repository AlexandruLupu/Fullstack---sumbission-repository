import React, { useState } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ createBlog }) => {
	const initialFormState = {
		title: "",
		author: "",
		url: "",
	};
	const [form, setForm] = useState(initialFormState);

	const handleFormCHange = (event) => {
		const updatedForm = { ...form, [event.target.name]: event.target.value };
		setForm(updatedForm);
	};

	const addNewBlog = (event) => {
		event.preventDefault();
		const blogObject = {
			title: form.title,
			author: form.author,
			url: form.url,
		};

		createBlog(blogObject);
		setForm(initialFormState);
	};

	return (
		<div>
			<h2>create new</h2>
			<form onSubmit={addNewBlog}>
				<div>
					title
					<input
						id="title"
						type="text"
						name="title"
						value={form.title}
						onChange={handleFormCHange}
					/>
				</div>
				<div>
					author
					<input
						id="author"
						type="text"
						name="author"
						value={form.author}
						onChange={handleFormCHange}
					/>
				</div>
				<div>
					url
					<input
						id="url"
						type="text"
						name="url"
						value={form.url}
						onChange={handleFormCHange}
					/>
				</div>
				<button id="create-blog" type="submit">
					create
				</button>
			</form>
		</div>
	);
};

BlogForm.propTypes = {
	createBlog: PropTypes.func.isRequired,
};

export default BlogForm;

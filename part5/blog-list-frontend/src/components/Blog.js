import React, { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, updateFunc, deleteFunc, user }) => {
	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: "solid",
		borderWidth: 1,
		marginBottom: 5,
	};
	const [visible, setVisible] = useState(false);
	const buttonLabel = visible ? "hide" : "view";

	const toggleVisibility = () => {
		setVisible(!visible);
	};

	const showDeleteButton = () => {
		if (blog.user.username === user.username) {
			return (
				<div>
					{visible && (
						<button
							id="delete-button"
							onClick={() => deleteFunc(blog)}
							style={{
								backgroundColor: "#6e82e6",
								borderRadius: "4px",
								border: "none",
							}}
						>
							remove
						</button>
					)}
				</div>
			);
		}
	};

	return (
		<div style={blogStyle}>
			<div className="testBlog">
				{blog.title} {blog.author}{" "}
				<button id="view-button" onClick={toggleVisibility}>
					{buttonLabel}
				</button>
				<p className="testUrl">{visible && blog.url}</p>
				<p className="testLikes">
					{visible && `likes ${blog.likes}`}{" "}
					{visible && (
						<button
							id="like-button"
							onClick={() => {
								updateFunc(blog);
							}}
						>
							like
						</button>
					)}
				</p>
				<p>{visible && blog.user.name}</p>
				{showDeleteButton()}
			</div>
		</div>
	);
};

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	updateFunc: PropTypes.func.isRequired,
	deleteFunc: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
};

export default Blog;

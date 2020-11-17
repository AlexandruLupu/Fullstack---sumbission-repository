import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blog";
import LoginForm from "./components/Login";
import loginServices from "./services/login";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [message, setMessage] = useState({
		data: null,
		color: null,
	});

	const blogFormRef = useRef();
	blogs.sort((a, b) => b.likes - a.likes);

	useEffect(() => {
		blogService.getAll().then((blogs) => {
			setBlogs(blogs);
		});
	}, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);

	console.log(user);
	console.log(blogs);
	const handleLogin = async (username, password) => {
		try {
			const user = await loginServices.login({
				username,
				password,
			});
			window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
			blogService.setToken(user.token);
			setUser(user);
		} catch (error) {
			console.log(error.message);
			setMessage({ data: "wrong username or password", color: "red" });
			setTimeout(() => {
				setMessage({ data: null, color: null });
			}, 5000);
		}
	};

	const handleLogout = () => {
		window.localStorage.removeItem("loggedBlogappUser");
		setUser(null);
	};

	const addNewBlog = async (blogObject) => {
		blogFormRef.current.toggleVisibility();
		const savedBlog = await blogService.create(blogObject);
		setBlogs(blogs.concat(savedBlog));
		setMessage({
			data: `a new blog ${blogObject.title} by ${blogObject.author} added`,
			color: "green",
		});
		setTimeout(() => {
			setMessage({ data: null, color: null });
		}, 5000);
	};

	const updateLikes = async (blog) => {
		const changedBlog = {
			title: blog.title,
			author: blog.author,
			likes: blog.likes + 1,
			user: blog.user.id,
			url: blog.url,
		};

		const returnedBlog = await blogService.update(blog.id, changedBlog);
		returnedBlog.user = blog.user;

		setBlogs(
			blogs.map((stateB) => (stateB.id !== blog.id ? stateB : returnedBlog))
		);
	};

	const handleDelete = (blog) => {
		let confirm = window.confirm(`Remove blog ${blog.title} by ${blog.author}`);
		if (confirm === true) {
			blogService.deleteBlog(blog.id);
			setBlogs(blogs.filter((stateB) => stateB.id !== blog.id));
			setMessage({ data: `Deleted ${blog.title}`, color: "green" });
			setTimeout(() => {
				setMessage({ data: null, color: null });
			}, 5000);
		} else {
			return;
		}
	};

	if (user === null) {
		return <LoginForm message={message} loginFunc={handleLogin} />;
	}

	return (
		<div>
			<h2>Blogs</h2>
			<Notification message={message} />
			{user.name} logged in{" "}
			<button onClick={handleLogout} id="logout-button">
				logout
			</button>{" "}
			<p></p>
			<Togglable buttonLabel="new blog" ref={blogFormRef}>
				<BlogForm createBlog={addNewBlog} />
			</Togglable>
			<div className="blog-list">
				{blogs.map((blog) => (
					<Blog
						key={blog.id}
						blog={blog}
						updateFunc={updateLikes}
						deleteFunc={handleDelete}
						user={user}
					/>
				))}
			</div>
		</div>
	);
};

export default App;

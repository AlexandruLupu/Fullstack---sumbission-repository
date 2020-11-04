const { TestScheduler } = require("jest");
const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test.helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");

beforeEach(async () => {
	await Blog.deleteMany();

	const blogObject = helper.initialBlogs.map((blog) => new Blog(blog));
	const promiseArray = blogObject.map((blog) => blog.save());
	await Promise.all(promiseArray);
});

describe("whne there is initially some blogs saved", () => {
	test("blogs are returned as json", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("all blogs are returned", async () => {
		const response = await api.get("/api/blogs");
		expect(response.body).toHaveLength(helper.initialBlogs.length);
	});

	test("the unique identifier is named id", async () => {
		const response = await api.get("/api/blogs");
		expect(response.body[0].id).toBeDefined();
	});
});

describe("addition of a new blog", () => {
	let token = null;
	let userId = null;
	beforeEach(async () => {
		await User.deleteMany({});

		const saltRounds = 10;
		const passwordHash = await bcrypt.hash("superSecr3t", saltRounds);

		const newUser = new User({
			username: "TestUser",
			name: "John Doe",
			passwordHash,
		});

		await newUser.save();

		const users = await helper.usersInDb();

		userId = users[0].id;

		const login = await api
			.post("/api/login")
			.send({ username: "TestUser", password: "superSecr3t" });

		token = login.body.token;
	});

	test("a valid blog can be added", async () => {
		const newBlog = {
			title: "Post a blog",
			author: "Alexandru",
			likes: 0,
			userId: userId,
		};

		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

		const title = blogsAtEnd.map((blog) => blog.title);
		expect(title).toContain("Post a blog");
	});

	test("like property is missing but defaults to 0", async () => {
		const newBlog = {
			title: "Like Property is missing",
			author: "Alex",
			userId: userId,
		};

		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(201);

		const blogsAtEnd = await helper.blogsInDb();

		const resultBlog = blogsAtEnd.find(
			(blog) => blog.title === "Like Property is missing"
		);

		expect(resultBlog).toMatchObject({
			title: "Like Property is missing",
			author: "Alex",
			likes: 0,
		});
	});

	test("blog without tile/author is not added", async () => {
		const newBlog = {
			likes: 15,
			userId: userId,
		};

		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(400);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});

	test("adding a blog fails with the propers status if a token is not provided", async () => {
		const newBlog = {
			title: "Post a blog",
			author: "Alexandru",
			likes: 0,
			userId: userId,
		};

		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(401)
			.expect("Content-Type", /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});
});

describe("deletion of a blog", () => {
	let token = null;
	let userId = null;
	beforeEach(async () => {
		await User.deleteMany({});

		const saltRounds = 10;
		const passwordHash = await bcrypt.hash("superSecr3t", saltRounds);

		const newUser = new User({
			username: "TestUser",
			name: "John Doe",
			passwordHash,
		});

		await newUser.save();

		const users = await helper.usersInDb();

		userId = users[0].id;

		const login = await api
			.post("/api/login")
			.send({ username: "TestUser", password: "superSecr3t" });

		token = login.body.token;
	});

	/* test("succeeds with status code 204 if id is valid", async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToDelete = blogsAtStart[0];

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(204);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
	});
 */

	test("succeeds with status code 204 if id is valid", async () => {
		// Post new blog that contains the userID
		const newBlog = {
			title: "Delete a blog",
			author: "Alexandru",
			likes: 0,
			userId: userId,
		};

		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(201);

		const blogsAtStart = await helper.blogsInDb();
		const blogToDelete = blogsAtStart.find(
			(blog) => blog.title === "Delete a blog"
		);

		await api
			.delete(`${blogToDelete.url}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(204);

		const blogsAtEnd = await helper.blogsInDb();
		// Because the blog was posted from this unit test
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});
});

describe("updating an individual blog", () => {
	test("succeds with status 200 when updating the amount of likes", async () => {
		const updateBlog = {
			likes: 300,
		};

		const blogsAtStart = await helper.blogsInDb();
		const blogToUpdate = blogsAtStart[0];

		await api.put(`${blogToUpdate.url}`).send(updateBlog).expect(200);
	});
});

afterAll(() => {
	mongoose.connection.close();
});

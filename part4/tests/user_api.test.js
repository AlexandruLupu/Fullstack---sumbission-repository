const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test.helper");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
const testHelper = require("./test.helper");

describe("when there is initially one user in db", () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash("supersecret", 10);
		const user = new User({ username: "root", passwordHash });

		await user.save();
	});

	test("creation succeeds with a fresh username", async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: "Satanel",
			name: "Lupu Alexandru",
			password: "supersecret2",
		};

		await api
			.post("/api/users")
			.send(newUser)
			.expect(200)
			.expect("Content-Type", /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

		const usernames = usersAtEnd.map((user) => user.username);
		expect(usernames).toContain(newUser.username);
	});

	test("creation fails with proper status code and message if username already taken", async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: "root",
			name: "SuperUser",
			password: "superSecr3t",
		};

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		expect(result.body.error).toContain("`username` to be unique");

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});

	describe("invalid users are not created", () => {
		test("creation fails with proper status code and message if password has less than 3 characters", async () => {
			const usersAtStart = await helper.usersInDb();

			const newUser = {
				username: "TestPass",
				name: "Password should be at least 3 characters",
				password: "Sk",
			};

			const result = await api
				.post("/api/users")
				.send(newUser)
				.expect(400)
				.expect("Content-Type", /application\/json/);

			expect(result.body.error).toContain(
				"password must be at least 3 characters long"
			);
			const usersAtEnd = await helper.usersInDb();
			expect(usersAtEnd).toHaveLength(usersAtStart.length);
		});
	});
});

afterAll(() => {
	mongoose.connection.close();
});

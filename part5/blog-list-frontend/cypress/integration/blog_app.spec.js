import { favoriteBlog, leastFavoriteBlog } from "../support/numberOfLikes";

describe("Blog app", function () {
	beforeEach(function () {
		cy.request("POST", "http://localhost:3001/api/testing/reset");
		const user = {
			name: "Alexandru Lupu",
			username: "Satanel",
			password: "sekret",
		};
		cy.request("POST", "http://localhost:3001/api/users/", user);
		cy.visit("http://localhost:3000");
	});

	it("Login form is shown", function () {
		cy.contains("log in to application");
		cy.contains("username");
		cy.contains("password");
	});

	describe("Login", function () {
		it("succeeds with correct credentials", function () {
			cy.get("#username").type("Satanel");
			cy.get("#password").type("sekret");
			cy.get("#login-button").click();
			cy.get("#logout-button").click();
		});

		it("fails with wrong credentials", function () {
			cy.get("#username").type("Satanel");
			cy.get("#password").type("wrongPassword");
			cy.get("#login-button").click();

			cy.get(".notification")
				.should("contain", "wrong username or password")
				.and("have.css", "color", "rgb(255, 0, 0)")
				.and("have.css", "border-style", "solid");
		});
	});

	describe("When logged in", function () {
		beforeEach(function () {
			cy.login({ username: "Satanel", password: "sekret" });
			cy.visit("http://localhost:3000");
		});

		it("A blog can be created", function () {
			cy.contains("new blog").click();

			let initialBlogs;
			let resultBlogs;
			cy.request("GET", "http://localhost:3001/api/blogs").then(
				(res) => (initialBlogs = res.body)
			);

			cy.get("#title").type("Blog created with cypress");
			cy.get("#author").type("Sat");
			cy.get("#url").type("http://localhost:3000");
			cy.get("#create-blog").click();

			cy.get(".testBlog").should("contain", "Blog created with cypress");

			cy.request("GET", "http://localhost:3001/api/blogs").then((res) => {
				resultBlogs = res.body;
				expect(resultBlogs.length).to.equal(initialBlogs.length + 1);
			});
		});
	});

	describe("Editing blogs", function () {
		beforeEach(function () {
			cy.login({ username: "Satanel", password: "sekret" });
			cy.visit("http://localhost:3000");
			cy.createBlog({
				title: "Blog 1",
				author: "Sat",
				url: "www.website.com",
			});
		});

		it("can increase the number of likes", function () {
			cy.get("#view-button").click();

			cy.request("GET", "http://localhost:3001/api/blogs").as("initialBlogs");
			cy.get("@initialBlogs").then((blog) => {
				// Likes in DB
				const initialLikesDB = blog.body[0].likes;
				// Front end likes
				cy.contains("likes").should("contain.text", initialLikesDB);

				cy.get("#like-button").click();

				cy.request("GET", "http://localhost:3001/api/blogs").then((result) => {
					// Likes in DB
					expect(result.body[0].likes).to.equal(initialLikesDB + 1);

					//Front end likes
					cy.contains("likes").should("contain.text", result.body[0].likes);
				});
			});
		});

		it("can be deleted", function () {
			cy.get("#view-button").click();
			cy.on("window:confirm", () => true);
			cy.get("#delete-button").click();
			cy.wait(1000); // waiting to delete the blog before sending the GET HTTP request

			// Check front end
			cy.get(".notification")
				.should("contain", `Deleted `)
				.and("have.css", "color", "rgb(0, 128, 0)")
				.and("have.css", "border-style", "solid");
			cy.get(".blog-list").should("be.empty");
			cy.contains("Blog 1").should("not.exist");
			// Check DB
			cy.request("GET", "http://localhost:3001/api/blogs").then((result) => {
				expect(result.body).to.be.empty;
			});
		});

		it("cannot be deleted if not the owner", function () {
			const user = {
				name: "Wrong User",
				username: "Wrong_user",
				password: "sekret",
			};
			cy.request("POST", "http://localhost:3001/api/users/", user);

			// Logout
			cy.get("#logout-button").click();

			// Login with a different user than the one in the beforeEach block
			cy.get("#username").type("Wrong_user");
			cy.get("#password").type("sekret");
			cy.get("#login-button").click();

			// View blog
			cy.get("#view-button").click();

			// Delete button should not be available if not the owner of the Blog
			cy.get("#delete-button").should("not.exist");
		});
	});

	describe("Blogs are ordered", function () {
		beforeEach(function () {
			cy.login({ username: "Satanel", password: "sekret" });
			cy.visit("http://localhost:3000");

			cy.createBlog({
				title: "Blog 1",
				author: "Sat",
				likes: 5,
				url: "www.website.com",
			});
			cy.createBlog({
				title: "Blog 2",
				author: "Sat",
				likes: 10,
				url: "www.website.com",
			});
			cy.createBlog({
				title: "Blog 3",
				author: "Sat",
				likes: 1,
				url: "www.website.com",
			});
		});
		it("Descending order", function () {
			cy.request("GET", "http://localhost:3001/api/blogs").then((result) => {
				const unorderedBlogs = result.body;
				console.log(unorderedBlogs);
				console.log(favoriteBlog(unorderedBlogs));
				console.log(leastFavoriteBlog(unorderedBlogs));

				// First Blog should be the result of favoriteBlog func
				cy.get(".blog-list")
					.first()
					.should("contain.text", favoriteBlog(unorderedBlogs).title);

				//Last Blog should be the result of leastFavouriteBlog func
				cy.get(".blog-list")
					.last()
					.should("contain.text", leastFavoriteBlog(unorderedBlogs).title);
			});
		});
	});
});

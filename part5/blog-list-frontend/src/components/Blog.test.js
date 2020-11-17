import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import { prettyDOM } from "@testing-library/dom";
import Blog from "./Blog";

describe("<Blog />", () => {
	const blog = {
		author: "Jest",
		title: "Blog list tests",
		id: "5faa4c412effb80ca092bbb6",
		likes: 20,
		url: "https://localhost:3000",
		user: {
			username: "Satanel",
			name: "Lupu Alexandru",
			id: "5fa667b6cb9c484c1c304223",
		},
	};

	const user = {
		name: "Lupu Alexandru",
		token:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNhdGFuZWwiLCJpZCI6IjVmYTY2N2I2Y2I5YzQ4NGMxYzMwNDIyMyIsImlhdCI6MTYwNTA5MTc3Nn0.H0sWh1ywxPj9H6fGLd9rSNbRDrCK8gkWtSutCzdXP5k",
		username: "Satanel",
	};

	const mockUpdateFunc = jest.fn();
	const mockDeleteFunc = jest.fn();

	let component;

	beforeEach(() => {
		component = render(
			<Blog
				blog={blog}
				user={user}
				updateFunc={mockUpdateFunc}
				deleteFunc={mockDeleteFunc}
			/>
		);
	});

	test("blog renders the blog's title and author, but not its url or nr. of likes", () => {
		expect(component.container).toHaveTextContent("Blog list tests");
		expect(component.container).toHaveTextContent("Jest");

		expect(component.container).not.toHaveTextContent("https://localhost:3000");
		expect(component.container).not.toHaveTextContent("likes");

		/* 	const div = component.container.querySelector(".testBlog");
		console.log(prettyDOM(div)); */
	});

	test("after clicking the button the url and nr. of likes are shown", () => {
		const button = component.getByText("view");
		fireEvent.click(button);

		expect(component.container.querySelector(".testUrl")).toHaveTextContent(
			"https://localhost:3000"
		);
		expect(component.container.querySelector(".testLikes")).toHaveTextContent(
			"likes"
		);
		/* const div = component.container.querySelector(".testBlog");
		console.log(prettyDOM(div)); */
	});

	test("like button clicked twice", () => {
		const viewButton = component.getByText("view");
		fireEvent.click(viewButton);

		const likeButton = component.getByText("like");
		fireEvent.click(likeButton);
		fireEvent.click(likeButton);

		expect(mockUpdateFunc.mock.calls).toHaveLength(2);
	});
});

import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import { prettyDOM } from "@testing-library/dom";
import BlogForm from "./BlogForm";

test("<BlogForm /> updates parent state and calls onSumbit", () => {
	const blog = {
		author: "Jest",
		title: "Blog list tests",
		url: "https://localhost:3000",
	};

	const createBlog = jest.fn();

	const component = render(<BlogForm createBlog={createBlog} />);

	const author = component.container.querySelector("#author");
	const title = component.container.querySelector("#title");
	const url = component.container.querySelector("#url");
	const form = component.container.querySelector("form");

	fireEvent.change(author, {
		target: { value: blog.author },
	});
	fireEvent.change(title, {
		target: { value: blog.title },
	});
	fireEvent.change(url, {
		target: { value: blog.url },
	});

	fireEvent.submit(form);

	expect(createBlog.mock.calls[0][0]).toMatchObject(blog);
});

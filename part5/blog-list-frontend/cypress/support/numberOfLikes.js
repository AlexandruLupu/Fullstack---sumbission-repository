export const favoriteBlog = (blogs) => {
	const mostLikes = blogs.reduce(
		(result, blog) => (result.likes > blog.likes ? result : blog),
		0
	);

	return (({ title, author, likes, url }) => ({
		title,
		author,
		likes,
		url,
	}))(mostLikes);
};

export const leastFavoriteBlog = (blogs) => {
	const mostLikes = blogs.reduce(
		(result, blog) => (result.likes < blog.likes ? result : blog),
		0
	);

	return (({ title, author, likes, url }) => ({
		title,
		author,
		likes,
		url,
	}))(mostLikes);
};

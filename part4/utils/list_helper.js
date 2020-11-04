const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	const reducer = (sum, item) => {
		return sum + item.likes;
	};

	return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
	const mostLikes = blogs.reduce(
		(result, blog) => (result.likes > blog.likes ? result : blog),
		0
	);

	return (({ title, author, likes }) => ({ title, author, likes }))(mostLikes);
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
};

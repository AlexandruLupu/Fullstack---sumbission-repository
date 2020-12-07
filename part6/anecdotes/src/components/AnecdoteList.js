import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { voteNew } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
	const anecdotes = useSelector(({ anecdotes, filter }) =>
		anecdotes.filter((anecdote) =>
			anecdote.content
				.toString()
				.toLowerCase()
				.startsWith(filter.toString().toLowerCase())
		)
	);

	anecdotes.sort((a, b) => b.votes - a.votes);
	const dispatch = useDispatch();
	console.log("Anecdotes", anecdotes);

	return (
		<div>
			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button
							onClick={() => {
								dispatch(voteNew(anecdote.id, anecdote));
								dispatch(setNotification("vote", anecdote.content, 5000));
							}}
						>
							vote
						</button>
					</div>
				</div>
			))}
		</div>
	);
};
export default AnecdoteList;

/*
onClick={() => {
								dispatch(voteNew(anecdote.id, anecdote));
								dispatch(lastAnecdoteVoted(anecdote.content));
								setTimeout(() => {
									dispatch(hideNotification());
								}, 5000);
							}}
*/

const notificationReducer = (state = "", action) => {
	switch (action.type) {
		case "SET_NOTIFICATION":
			return action.notification;
		case "HIDE_NOTIFICATION":
			return "";
		default:
			return state;
	}
};

export const clearNotification = () => {
	return {
		type: "HIDE_NOTIFICATION",
	};
};

export const setNotification = (type, content, time) => {
	const message = type === "vote" ? "You voted " : "You added";

	return (dispatch) => {
		dispatch({
			type: "SET_NOTIFICATION",
			notification: `${message} "${content}"`,
		});

		setTimeout(() => {
			dispatch(clearNotification());
		}, time);
	};
};

export default notificationReducer;

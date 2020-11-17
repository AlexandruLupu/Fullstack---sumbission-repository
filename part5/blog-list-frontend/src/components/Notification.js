import React from "react";

const Notification = (props) => {
	const notificationStyle = {
		color: props.message.color,
		background: "lightgrey",
		fontSize: "20px",
		borderStyle: "solid",
		borderRadius: "5px",
		padding: "10px",
		marginBottom: "10px",
	};

	if (props.message.data === null) {
		return null;
	}

	return (
		<div style={notificationStyle} className="notification">
			{props.message.data}
		</div>
	);
};

export default Notification;

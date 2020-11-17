import React, { useState } from "react";
import Notification from "./Notification";
import PropTypes from "prop-types";

const LoginForm = ({ message, loginFunc }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async (event) => {
		event.preventDefault();

		loginFunc(username, password);
		setUsername("");
		setPassword("");
	};

	const handleUserNameCHange = (event) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	return (
		<div>
			<h2>log in to application</h2>
			<Notification message={message} />
			<form onSubmit={handleLogin}>
				<div>
					username
					<input
						id="username"
						type="text"
						value={username}
						name="Username"
						onChange={handleUserNameCHange}
					/>
				</div>
				<div>
					password
					<input
						id="password"
						type="password"
						value={password}
						name="Password"
						onChange={handlePasswordChange}
					/>
				</div>
				<button type="submit" id="login-button">
					login
				</button>
			</form>
		</div>
	);
};

LoginForm.propTypes = {
	message: PropTypes.object.isRequired,
	loginFunc: PropTypes.func.isRequired,
};

export default LoginForm;

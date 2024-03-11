import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField } from "./components/Fields";

function LogIn() {
	const [formData, setFormData] = useState({
		username: "",
		password: ""
	});

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const navigate = useNavigate(); // Utilize the useNavigate hook for programmatic navigation

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		// http://localhost:3000/
		// https://dummy-blog.adaptable.app/user/log-in
		const apiUrl = "http://localhost:3000/user/log-in";
		try {
			const response = await axios.post(apiUrl, formData, {
				headers: {
					// Set any necessary headers, e.g., for authentication or content type:
					"Content-Type": "application/json" // Example for JSON data
				}
			});

			if (response.data.accessToken) {
				localStorage.setItem("accessToken", `${response.data.accessToken}`);
				console.log(response.data.accessToken);

				navigate("/posts"); // Redirect to desired page after successful login
			} else {
				console.log(response.data.message);
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div>
			<h1>Log in</h1>
			<form onSubmit={onSubmit}>
				<div className='labels-inputs'>
					<TextField
						name='username'
						type='text'
						onInput={handleInputChange}
						value={formData.username}
					>
						Username:
					</TextField>
					<br />
					<TextField
						name='password'
						type='text'
						onInput={handleInputChange}
						value={formData.password}
					>
						Password:
					</TextField>
					<br />
				</div>
				<button type='submit'>Log in</button>
			</form>
		</div>
	);
}

export default LogIn;

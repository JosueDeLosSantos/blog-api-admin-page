import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Field from "./field";

function LogIn() {
	const [formData, setFormData] = useState({
		username: "",
		password: ""
	});

	const navigate = useNavigate(); // Utilize the useNavigate hook

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		const apiUrl = "https://dummy-blog.adaptable.app/user/log-in";
		try {
			const response = await axios.post(apiUrl, formData, {
				headers: {
					// Set any necessary headers, e.g., for authentication or content type:
					"Content-Type": "application/json" // Example for JSON data
				}
			});
			if (response.data.accessToken) {
				localStorage.setItem("accessToken", `${response.data.accessToken}`);
				// Redirect to desired page after successful login
				navigate("/posts"); // Replace "/home" with your target route
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
					<Field
						name='username'
						type='text'
						onInput={handleInputChange}
						value={formData.username}
					>
						Username:
					</Field>
					<br />
					<Field
						name='password'
						type='text'
						onInput={handleInputChange}
						value={formData.password}
					>
						Password:
					</Field>
					<br />
				</div>
				<button type='submit'>Log in</button>
			</form>
		</div>
	);
}

export default LogIn;

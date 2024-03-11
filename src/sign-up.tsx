import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField } from "./components/Fields";

function SignUp() {
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		username: "",
		password: "",
		passwordConfirmation: ""
	});

	const navigate = useNavigate();

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		// http://localhost:3000/user/sign-up
		//https://dummy-blog.adaptable.app/user/sign-up
		const apiUrl = "http://localhost:3000/user/sign-up";
		console.log(JSON.stringify(formData));
		try {
			const response = await axios.post(apiUrl, formData, {
				headers: {
					// Set any necessary headers, e.g., for authentication or content type:
					"Content-Type": "application/json" // Example for JSON data
				}
			});
			console.log(response.data);
			if (response.data.message) {
				navigate("/log-in");
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div>
			<h1>Sign up</h1>
			<form onSubmit={onSubmit}>
				<div className='labels-inputs'>
					<TextField
						name='first_name'
						type='text'
						onInput={handleInputChange}
						value={formData.first_name}
					>
						First Name:
					</TextField>
					<br />
					<TextField
						name='last_name'
						type='text'
						onInput={handleInputChange}
						value={formData.last_name}
					>
						Last Name:
					</TextField>
					<br />
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
					<TextField
						name='passwordConfirmation'
						type='text'
						onInput={handleInputChange}
						value={formData.passwordConfirmation}
					>
						Password Confirmation:
					</TextField>
					<br />
				</div>
				<button type='submit'>Sign up</button>
			</form>
		</div>
	);
}

export default SignUp;

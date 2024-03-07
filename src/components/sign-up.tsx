import { FormEvent, useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import Field from "./field";

function SignUp() {
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		username: "",
		password: "",
		passwordConfirmation: ""
	});

	// const navigate = useNavigate();

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		const apiUrl = "https://dummy-blog.adaptable.app/user/sign-up";
		console.log(JSON.stringify(formData));
		try {
			const response = await axios.post(apiUrl, formData, {
				headers: {
					// Set any necessary headers, e.g., for authentication or content type:
					"Content-Type": "application/json" // Example for JSON data
				}
			});
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div>
			<h1>Sign up</h1>
			<form onSubmit={onSubmit}>
				<div className='labels-inputs'>
					<Field
						name='first_name'
						type='text'
						onInput={handleInputChange}
						value={formData.first_name}
					>
						First Name:
					</Field>
					<br />
					<Field
						name='last_name'
						type='text'
						onInput={handleInputChange}
						value={formData.last_name}
					>
						Last Name:
					</Field>
					<br />
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
					<Field
						name='passwordConfirmation'
						type='text'
						onInput={handleInputChange}
						value={formData.passwordConfirmation}
					>
						Password Confirmation:
					</Field>
					<br />
				</div>
				<button type='submit'>Sign up</button>
			</form>
		</div>
	);
}

export default SignUp;

import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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
		<div className='container mx-auto max-w-md h-full flex bg-white rounded-lg shadow overflow-hidden mt-14'>
			<div className='w-full p-8'>
				<h1 className='font-PressStart2P text-xl mb-10 text-center text-indigo-600 hover:text-indigo-700'>
					<Link to='../'>{"<JCODER>"}</Link>
				</h1>
				<form onSubmit={onSubmit} className='mt-10'>
					<h1 className='text-2xl font-bold'>Sign up to create an account</h1>

					<div className='mb-4 mt-10'>
						<label
							className='block text-gray-700 text-base font-semibold mb-2'
							htmlFor='last_name'
						>
							Last Name
						</label>
						<input
							className='text-base appearance-none rounded w-full py-5 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10'
							name='last_name'
							type='text'
							placeholder='Your last name'
							onInput={handleInputChange}
							value={formData.last_name}
						/>
					</div>
					<div className='mb-4 mt-6'>
						<label
							className='block text-gray-700 text-base font-semibold mb-2'
							htmlFor='first_name'
						>
							First Name
						</label>
						<input
							className='text-base appearance-none rounded w-full py-5 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10'
							name='first_name'
							type='text'
							placeholder='Your first name'
							onInput={handleInputChange}
							value={formData.first_name}
						/>
					</div>
					<div className='mb-4 mt-6'>
						<label
							className='block text-gray-700 text-base font-semibold mb-2'
							htmlFor='username'
						>
							Username
						</label>
						<input
							className='text-base appearance-none rounded w-full py-5 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10'
							name='username'
							type='text'
							placeholder='Your username'
							onInput={handleInputChange}
							value={formData.username}
						/>
					</div>
					<div className='mb-6 mt-6'>
						<label
							className='block text-gray-700 text-base font-semibold mb-2'
							htmlFor='password'
						>
							Password
						</label>
						<input
							className='text-base bg-gray-200 appearance-none rounded w-full py-5 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline h-10'
							name='password'
							type='password'
							placeholder='Your password'
							onInput={handleInputChange}
							value={formData.password}
						/>
					</div>
					<div className='mb-6 mt-6'>
						<label
							className='block text-gray-700 text-base font-semibold mb-2'
							htmlFor='passwordConfirmation'
						>
							Confirm Password
						</label>
						<input
							className='text-base bg-gray-200 appearance-none rounded w-full py-5 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline h-10'
							name='passwordConfirmation'
							type='password'
							placeholder='Confirm your password'
							onInput={handleInputChange}
							value={formData.passwordConfirmation}
						/>
					</div>

					<div className='flex w-full mt-8'>
						<button
							className='w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-2 px-4 font-semibold rounded focus:outline-none focus:shadow-outline h-15'
							type='submit'
						>
							Sign up
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default SignUp;

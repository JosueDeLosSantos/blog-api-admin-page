import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";

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

	const [errors, setErrors] = useState({
		first_name: "",
		last_name: "",
		username: "",
		password: "",
		passwordConfirmation: ""
	});

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		// http://localhost:3000/user/sign-up
		//https://dummy-blog.adaptable.app/user/sign-up
		const apiUrl = "http://localhost:3000/user/sign-up";
		try {
			const response = await axios.post(apiUrl, formData);

			if (response.data.errors) {
				/* fix form's error management */
				const newErrors = {
					first_name: "",
					last_name: "",
					username: "",
					password: "",
					passwordConfirmation: ""
				};
				while (response.data.errors.length > 0) {
					const error = response.data.errors.shift();
					switch (error.path) {
						case "first_name":
							newErrors.first_name = error.msg;
							break;
						case "last_name":
							newErrors.last_name = error.msg;
							break;
						case "username":
							newErrors.username = error.msg;
							break;
						case "password":
							newErrors.password = error.msg;
							break;
						case "passwordConfirmation":
							newErrors.passwordConfirmation = error.msg;
							break;
						default:
							break;
					}
				}
				setErrors(newErrors);
			} else {
				navigate("/log-in");
			}
		} catch (error) {
			const axiosError = error as AxiosError;
			console.log(axiosError.message); // Network Error
		}
	}

	return (
		<div className='container mx-auto max-w-md h-full flex bg-white rounded-lg shadow overflow-hidden mt-14'>
			<div className='w-full p-8'>
				<h1 className='font-PressStart2P text-xl mb-10 text-center'>
					<Link
						className='text-slate-900 visited:text-slate-900 hover:text-slate-700'
						to='../'
					>
						{"<JCODER>"}
					</Link>
				</h1>
				<form onSubmit={onSubmit} className='mt-10'>
					<h1 className='text-2xl font-bold'>Sign up to create an account</h1>

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
						<span className='text-red-600 max-sm:text-xs sm:text-sm'>
							{errors.first_name}
						</span>
					</div>
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
						<span className='text-red-600 max-sm:text-xs sm:text-sm'>
							{errors.last_name}
						</span>
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
						<span className='text-red-600 max-sm:text-xs sm:text-sm'>
							{errors.username}
						</span>
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
						<span className='text-red-600 max-sm:text-xs sm:text-sm'>
							{errors.password}
						</span>
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
						<span className='text-red-600 max-sm:text-xs sm:text-sm'>
							{errors.passwordConfirmation}
						</span>
					</div>

					<div className='flex w-full mt-8'>
						<button
							className='w-full bg-slate-600 hover:bg-slate-700 text-white text-lg py-2 px-4 font-semibold rounded focus:outline-none focus:shadow-outline h-15'
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

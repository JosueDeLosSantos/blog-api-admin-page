import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";

function SignUp() {
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		username: "",
		password: "",
		passwordConfirmation: ""
	});

	const navigate = useNavigate();

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const [Unauthorized, setUnauthorized] = useState("");

	const [errors, setErrors] = useState({
		first_name: "",
		last_name: "",
		email: "",
		username: "",
		password: "",
		passwordConfirmation: ""
	});
	// MARK: onSubmit
	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		// http://localhost:3000/user/sign-up
		//https://dummy-blog.adaptable.app/user/sign-up
		const apiUrl = "http://localhost:3000/user/admin/sign-up";
		try {
			const response = await axios.post(apiUrl, formData);

			if (response.data.errors) {
				/* fix form's error management */
				const newErrors = {
					first_name: "",
					last_name: "",
					email: "",
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
						case "email":
							newErrors.email = error.msg;
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
			if (axiosError.response) {
				type notAutorized = { message: string };
				const errorResponse = axiosError.response.data as notAutorized;
				setUnauthorized(errorResponse.message);
				setErrors({
					first_name: "",
					last_name: "",
					email: "",
					username: "",
					password: "",
					passwordConfirmation: ""
				});
			} else {
				navigate("/server-error");
			}
		}
	}
	// MARK: return
	return (
		<div className='container mx-auto max-w-md h-full flex bg-white rounded-lg shadow overflow-hidden mt-14'>
			<div className='w-full p-8'>
				<h1 className='font-PressStart2P text-xl mb-10 text-center'>
					<Link
						className='text-[#721ea3] visited:text-[#540d7d] hover:text-[#721ea3]'
						to='../'
					>
						{"<JCODER>"}
					</Link>
				</h1>
				<form onSubmit={onSubmit} className='mt-10'>
					<h1 className='text-2xl font-bold'>Sign up to create an account</h1>

					<div>
						<span className='text-red-600 max-sm:text-xs sm:text-sm'>
							{Unauthorized}
						</span>
					</div>

					<div className='mb-4 mt-6'>
						<label
							className='block text-gray-700 text-base font-semibold mb-2'
							htmlFor='first_name'
						>
							First Name
						</label>
						<input
							className='text-base box-border border border-[#461c5f] appearance-none rounded w-full py-4 px-2 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10'
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
					<div className='mb-4 mt-6'>
						<label
							className='block text-gray-700 text-base font-semibold mb-2'
							htmlFor='last_name'
						>
							Last Name
						</label>
						<input
							className='text-base box-border border border-[#461c5f] appearance-none rounded w-full py-4 px-2 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10'
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
							htmlFor='email'
						>
							Email
						</label>
						<input
							className='text-base box-border border border-[#461c5f] appearance-none rounded w-full py-4 px-2 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10'
							name='email'
							type='text'
							placeholder='Your email address'
							onInput={handleInputChange}
							value={formData.email}
						/>
						<span className='text-red-600 max-sm:text-xs sm:text-sm'>
							{errors.email}
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
							className='text-base box-border border border-[#461c5f] appearance-none rounded w-full py-4 px-2 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10'
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
							className='text-base box-border border border-[#461c5f] bg-gray-200 appearance-none rounded w-full py-4 px-2 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline h-10'
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
							className='text-base border border-[#461c5f] box-border bg-gray-200 appearance-none rounded w-full py-4 px-2 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline h-10'
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
							className='w-full bg-[#721ea3] hover:bg-[#540d7d] border border-[#461c5f] text-white text-sm py px-2 font-semibold rounded h-10'
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

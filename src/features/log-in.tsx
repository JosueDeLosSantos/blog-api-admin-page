import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import codeImage from "../../public/images/safar-safarov-koOdUvfGr4c-unsplash.jpg";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { switchPrivilege } from "./posts/privilegeSlice";

function LogIn() {
	const dispatch: AppDispatch = useDispatch();
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
			const response = await axios.post(apiUrl, formData);

			if (response.data.accessToken) {
				localStorage.setItem("accessToken", `${response.data.accessToken}`);
				console.log(response.data.accessToken);
				dispatch(switchPrivilege("admin"));
				navigate("/"); // Redirect to desired page after successful login
			} else {
				/* fix form error management */
				console.log(response.data);
			}
		} catch (error) {
			const axiosError = error as AxiosError;
			console.log(axiosError.message); // Network Error
		}
	}

	return (
		<div className='container max-w-md mx-auto xl:max-w-3xl h-full flex bg-white rounded-lg shadow overflow-hidden'>
			<div className='relative hidden xl:block xl:w-1/2 h-full'>
				<img
					className='absolute h-auto w-full object-cover'
					src={codeImage}
					alt='image of computers displaying code lines'
				/>
			</div>
			<div className='w-full xl:w-1/2 p-8'>
				<h1 className='font-PressStart2P text-xl mb-10 text-center text-indigo-600 hover:text-indigo-700'>
					<Link to='../'>{"<JCODER>"}</Link>
				</h1>
				<form onSubmit={onSubmit}>
					<h1 className='text-2xl font-bold'>Sign in to your account</h1>
					<div>
						<span className='text-gray-600 text-sm'>
							Don't have an account?
						</span>{" "}
						<span className='text-indigo-600 hover:text-indigo-700 text-sm font-semibold'>
							<Link to='../sign-up'>Sign up</Link>
						</span>
					</div>
					<div className='mb-4 mt-6'>
						<label
							className='block text-gray-700 text-sm font-semibold mb-2'
							htmlFor='username'
						>
							Username
						</label>
						<input
							className='text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10'
							name='username'
							type='text'
							placeholder='Your username'
							onInput={handleInputChange}
							value={formData.username}
						/>
					</div>
					<div className='mb-6 mt-6'>
						<label
							className='block text-gray-700 text-sm font-semibold mb-2'
							htmlFor='password'
						>
							Password
						</label>
						<input
							className='text-sm bg-gray-200 appearance-none rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline h-10'
							name='password'
							type='password'
							placeholder='Your password'
							onInput={handleInputChange}
							value={formData.password}
						/>
					</div>

					<div className='flex w-full mt-8'>
						<button
							className='w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 font-semibold rounded focus:outline-none focus:shadow-outline h-10'
							type='submit'
						>
							Sign in
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default LogIn;

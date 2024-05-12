import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

type commentType = {
	_id: string;
	comment: string;
	date: string;
	email: string;
	name: string;
	post: string;
	__v: number;
};

function CommentsBox({
	post_id,
	commentsAction
}: {
	post_id: string;
	commentsAction: (arg: commentType) => void;
}) {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		_id: "",
		comment: "",
		name: "",
		email: "",
		date: "",
		post: post_id,
		__v: 0
	});

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const [errors, setErrors] = useState({
		email: "",
		name: "",
		comment: ""
	});

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		// http://localhost:3000/
		// https://dummy-blog.adaptable.app/comments
		const apiUrl = "http://localhost:3000/user/comments";
		try {
			// get security token
			const jwtToken = localStorage.getItem("accessToken");
			const headers: Record<string, string> = {};
			if (jwtToken) {
				headers["Authorization"] = `Bearer ${jwtToken}`;
			}

			const response = await axios.post(apiUrl, formData, {
				headers: headers
			});

			/* If no errors are returned, add a date and id to the most recent added comment to keep 
			the page updated */
			if (!response.data.errors) {
				formData.date = response.data.post.comments[0].date;
				formData._id = response.data.post.comments[0]._id;
				// update comments array
				commentsAction(formData);
				// clear form fields
				setFormData({
					_id: "",
					comment: "",
					name: "",
					email: "",
					date: "",
					post: post_id,
					__v: 0
				});
				// clear errors
				setErrors({ email: "", name: "", comment: "" });
			} else {
				const newErrors = { email: "", name: "", comment: "" };
				while (response.data.errors.length > 0) {
					const error = response.data.errors.shift();
					switch (error.path) {
						case "email":
							newErrors.email = error.msg;
							break;
						case "name":
							newErrors.name = error.msg;
							break;
						case "comment":
							newErrors.comment = error.msg;
							break;
						default:
							break;
					}
				}
				setErrors(newErrors);
			}
		} catch (error) {
			const axiosError = error as AxiosError;

			if (
				axiosError?.response?.status === 403 ||
				axiosError?.response?.status === 401
			) {
				navigate("/log-in");
			} else {
				navigate("/server-error");
			}
		}
	}

	return (
		<div className='box-border border-solid border-0 max-w-screen-md mx-auto flex justify-center items-center'>
			<div className='box-border w-11/12 mx-auto mt-14 mb-8'>
				<form className='box-border w-full p-4 rounded ' onSubmit={onSubmit}>
					<h2 className='text-xl mb-4 tracking-wider font-lighter '>
						Leave a Comment
					</h2>
					<p className='text-gray-600 mb-4'>
						Your email address will not be published. Required fields are
						marked *
					</p>
					<div className='w-full'>
						<textarea
							name='comment'
							onInput={handleCommentChange}
							className='box-border bg-slate-100 w-full px-3 py-2 mb-3 rounded-sm border border-solid border-slate-300  focus:outline-none  focus:border-blue-300 resize-none'
							placeholder='Type Comment...*'
							rows={5}
							value={formData.comment}
							required
						></textarea>
						<span className='text-red-600 max-sm:text-xs sm:text-sm'>
							{errors.comment}
						</span>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
						<div className='mb-1'>
							<input
								type='text'
								name='name'
								onInput={handleInputChange}
								className='box-border bg-slate-100 w-full px-3 py-2 rounded-sm border border-solid border-slate-300  focus:outline-none focus:border-blue-300'
								placeholder='Name*'
								value={formData.name}
								required
							/>
							<span className='text-red-600 max-sm:text-xs sm:text-sm'>
								{errors.name}
							</span>
						</div>
						<div className='mb-1'>
							<input
								type='email'
								name='email'
								onInput={handleInputChange}
								className='box-border bg-slate-100 w-full px-3 py-2 rounded-sm border border-solid border-slate-300  focus:outline-none focus:border-blue-300'
								placeholder='Email*'
								value={formData.email}
								required
							/>
							<span className='text-red-600 max-sm:text-xs sm:text-sm'>
								{errors.email}
							</span>
						</div>
					</div>
					<div className='box-border flex'>
						<button
							type='submit'
							className='mt-5 py-4 px-6 bg-black text-white rounded-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800'
						>
							Post Comment →
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CommentsBox;

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

	const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const [commentError, setCommentError] = useState("");
	// MARK: onSubmit
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
				formData.name = `${response.data.post.user.first_name} ${response.data.post.user.last_name}`;
				formData.email = response.data.post.user.email;

				// update comments array
				commentsAction(formData);
				// clear form fields
				setFormData({
					_id: "",
					comment: "",
					name: `${response.data.post.user.first_name} ${response.data.post.user.last_name}`,
					email: response.data.post.user.email,
					date: "",
					post: post_id,
					__v: 0
				});
				// clear errors
				setCommentError("");
			} else {
				setCommentError(response.data.errors[0].msg);
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
	// MARK: Form
	return (
		<div className='box-border border-solid border-0 max-w-screen-md mx-auto flex justify-center items-center'>
			<div className='box-border w-11/12 mx-auto mt-14 mb-8'>
				<form className='box-border w-full p-4 rounded ' onSubmit={onSubmit}>
					<h2 className='text-xl mb-4 tracking-wider font-lighter '>
						Leave a Comment
					</h2>
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
							{commentError}
						</span>
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

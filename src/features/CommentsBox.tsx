import { FormEvent, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

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
	const [formData, setFormData] = useState({
		_id: uuidv4(),
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

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		// http://localhost:3000/
		// https://dummy-blog.adaptable.app/user/log-in
		const apiUrl = "http://localhost:3000/";
		try {
			const response = await axios.post(apiUrl, formData);
			console.log(response);
			// Add a date to the most recent added comment to keep the page updated
			formData.date = response.data.date;
			// update comments array to avoid unnecessary API calls
			commentsAction(formData);
		} catch (error) {
			console.log(error);
		}

		console.log(formData);
	}

	return (
		<div className='box-border border-solid border-t border-r-0 border-l-0 border-b-0 border-slate-200 max-w-screen-md mx-auto flex justify-center items-center'>
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
							onInput={handleInputChange}
							className='box-border bg-slate-100 w-full px-3 py-2 mb-3 rounded-sm border dark:border-none  focus:outline-none border-solid focus:border-dashed resize-none'
							placeholder='Type Comment...*'
							rows='5'
							required
						></textarea>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
						<div className='mb-1'>
							<input
								type='text'
								name='name'
								onInput={handleInputChange}
								className='box-border bg-slate-100 w-full px-3 py-2 rounded-sm border dark:border-none  focus:outline-none border-solid focus:border-dashed'
								placeholder='Name*'
								required
							/>
						</div>
						<div className='mb-1'>
							<input
								type='email'
								name='email'
								onInput={handleInputChange}
								className='box-border bg-slate-100 w-full px-3 py-2 rounded-sm border dark:border-none  focus:outline-none border-solid focus:border-dashed'
								placeholder='Email*'
								required
							/>
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

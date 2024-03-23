import { FormEvent, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { postsList } from "../features/posts/postsSlice";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { TextField, TextAreaField, FileField } from "./components/Fields";

type formDataType = {
	title: string;
	description: string;
	post: string;
	author: string;
	file: string | undefined;
};

function CreatePost() {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const [formData, setFormData] = useState<formDataType>({
		title: "",
		description: "",
		post: "",
		author: "",
		file: undefined
	});

	const handlePostChange = (arg: string): void => {
		setFormData({ ...formData, post: arg });
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value, files } = event.target;
		setFormData({ ...formData, [name]: files?.length ? files[0] : value });
	};

	async function onSubmit(e: FormEvent) {
		e.preventDefault();

		// http://localhost:3000/user/sign-up
		//https://dummy-blog.adaptable.app/user/sign-up
		const apiUrl = "http://localhost:3000/user/create-post";
		const jwtToken = localStorage.getItem("accessToken");
		const headers: Record<string, string> = {};
		if (jwtToken) {
			headers["Authorization"] = `Bearer ${jwtToken}`;
		}
		console.log(formData);

		const response = await axios
			.postForm(apiUrl, formData, {
				headers: {
					Authorization: `Bearer ${jwtToken}`
				}
			})
			.catch((error) => {
				return error;
			});
		dispatch(postsList(response.data.posts)); // update global state

		navigate("/");
	}

	const editorConfiguration = {
		// Displaying the proper UI element in the toolbar.
		toolbar: [
			"heading",
			"alignment",
			"|",
			"bold",
			"italic",
			"link",
			"bulletedList",
			"numberedList",
			"|",
			"outdent",
			"indent",
			"|",
			"blockQuote",
			"insertTable",
			"undo",
			"redo"
		]
	};

	return (
		<>
			<div className='py-12'>
				<div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
					<div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
						<div className='p-6 bg-white border-b border-gray-200'>
							<form onSubmit={onSubmit}>
								<div className='mb-4'>
									<label
										htmlFor='title'
										className='text-xl text-gray-600'
									>
										Title <span className='text-red-500'>*</span>
									</label>
									<input
										type='text'
										className='border-2 border-gray-300 p-2 w-full'
										name='title'
										onInput={handleInputChange}
										value={formData.title}
										required
									/>
								</div>

								<div className='mb-4'>
									<label
										htmlFor='description'
										className='text-xl text-gray-600'
									>
										Description{" "}
										<span className='text-red-500'>*</span>
									</label>
									<input
										type='text'
										className='border-2 border-gray-300 p-2 w-full'
										name='description'
										onInput={handleInputChange}
										value={formData.description}
									/>
								</div>

								<div className='mb-8'>
									<label className='text-xl text-gray-600'>
										Content <span className='text-red-500'>*</span>
									</label>

									<CKEditor
										editor={ClassicEditor}
										data={formData.post}
										config={editorConfiguration}
										onChange={(_, editor) => {
											const content = editor.getData(); // Get the updated content
											handlePostChange(content); // Update the state
										}}
									/>
								</div>

								<div className='mb-4'>
									<label
										htmlFor='author'
										className='text-xl text-gray-600'
									>
										Author <span className='text-red-500'>*</span>
									</label>
									<input
										type='text'
										className='border-2 border-gray-300 p-2 w-full'
										name='author'
										onInput={handleInputChange}
										value={formData.author}
										required
									/>
								</div>

								<div className='mb-4'>
									<label
										htmlFor='file'
										className='text-xl text-gray-600'
									>
										Image <span className='text-red-500'>*</span>
									</label>
									<input
										type='file'
										className='border-2 border-gray-300 p-2 w-full'
										name='file'
										onChange={handleInputChange}
									/>
								</div>

								<div className='flex p-1'>
									<button
										role='submit'
										className='p-3 bg-blue-500 text-white hover:bg-blue-400'
									>
										Submit
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default CreatePost;

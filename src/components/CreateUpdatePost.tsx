import { FormEvent, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { addPost, updatePost } from "../features/posts/postsSlice";
import { switchPrivilege } from "../features/posts/privilegeSlice";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import he from "he"; // decodes mongodb encoded HTML
import { onePostType } from "../features/posts/types";

type fileType = {
	filename: string;
	originalname: string;
	mimetype: string;
	path: string;
	size: number;
};

type formDataType = {
	title: string;
	description: string;
	post: string;
	author: string;
	file: string | File | fileType;
	trash: string;
};

function CreateUpdatePost({ operation }: { operation: string }) {
	const dispatch: AppDispatch = useDispatch();
	const { name } = useParams();
	const { state }: { state: onePostType | null } = useLocation();
	const [formData, setFormData] = useState<formDataType>({
		/* mongodb do not process apostrophes and commas as humans do, so he.decode helps to fix that */
		title: state !== null ? he.decode(state.title) : "",
		description: state !== null ? he.decode(state.description) : "",
		post: state !== null ? he.decode(state.post) : "",
		author: state !== null ? he.decode(state.author) : "",
		file: state !== null ? state.file : "",
		// if the initial state.post.file value includes medatadata for any file stored in the server
		// that filename is saved in a temporal trash state. It will be useful if
		// a new file is uploaded so that we can command the server to delete the old one.
		trash: ""
	});
	const navigate = useNavigate();

	const handlePostChange = (arg: string): void => {
		setFormData({ ...formData, post: arg });
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value, files } = event.target;
		setFormData({ ...formData, [name]: files?.length ? files[0] : value });
	};

	async function onSubmit(e: FormEvent) {
		e.preventDefault();

		const jwtToken = localStorage.getItem("accessToken");
		const headers: Record<string, string> = {};

		if (operation === "update") {
			const updateFormData = formData;
			updateFormData.trash = state!.file.filename;

			if (formData.file === "") {
				updateFormData.file = state!.file;
			}

			// http://localhost:3000/user/posts/:name
			//https://dummy-blog.adaptable.app/user/posts/:name
			const apiUrl = `http://localhost:3000/user/posts/${name}`;
			if (jwtToken) {
				headers["Authorization"] = `Bearer ${jwtToken}`;
			}

			try {
				const response = await axios.postForm(apiUrl, updateFormData, {
					headers: headers
				});

				if (response.data.errors) {
					/* fix form's error management */
					console.log(response);
				} else {
					delete response.data.post.post;
					delete response.data.post.comments;
					dispatch(updatePost(response.data.post)); // update global state
					navigate("/");
				}
			} catch (error) {
				const axiosError = error as AxiosError;
				// if it's forbidden or unauthorized it will be logged out
				if (axiosError.message !== "Network Error") {
					dispatch(switchPrivilege("user")); // logout
					navigate("/log-in");
				} else {
					console.log(axiosError.message); //Network Error
				}
			}
		} else {
			// if no image is selected the submition won't work
			if (formData.file === "") {
				return;
			}
			const apiUrl = "http://localhost:3000/user/create-post";
			if (jwtToken) {
				headers["Authorization"] = `Bearer ${jwtToken}`;
			}

			try {
				const response = await axios.postForm(apiUrl, formData, {
					headers: {
						Authorization: `Bearer ${jwtToken}`
					}
				});

				// state will be updated only if an image is selected
				// and if no errors are returned from the post request
				if (formData.file !== "" && !response.data.errors) {
					delete response.data.post.post;
					delete response.data.post.comments;
					dispatch(addPost(response.data.post)); // update global state
					navigate("/");
				} else {
					/* fix form error management */
					console.log(response.data.errors);
				}
			} catch (error) {
				const axiosError = error as AxiosError;
				// if it's forbidden or unauthorized it will be logged out
				if (axiosError.message !== "Network Error") {
					dispatch(switchPrivilege("user")); // logout
					navigate("/log-in");
				} else {
					console.log(axiosError.message); //Network Error
				}
			}
		}
	}

	const editorConfiguration = {
		// Displaying the proper UI element in the toolbar.
		toolbar: [
			"heading",
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
											/* const toolbarItems = Array.from(
													editor.ui.componentFactory.names() // display available list of toolbar editor
												);
												console.log(toolbarItems.sort()); */
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
										accept='image/jpeg, image/png'
										className='border-2 border-gray-300 p-2 w-full'
										name='file'
										onChange={handleInputChange}
									/>
									{operation === "create" && formData.file === "" && (
										<span className='text-xs text-red-700'>
											Selecting an image is mandatory!
										</span>
									)}
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

export default CreateUpdatePost;

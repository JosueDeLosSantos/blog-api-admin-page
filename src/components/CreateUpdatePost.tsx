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
import { editPostType } from "../features/posts/types";

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
	comments: string[];
	file: string | File | fileType;
	trash: string;
};

function CreateUpdatePost({ operation }: { operation: string }) {
	const dispatch: AppDispatch = useDispatch();
	const { name } = useParams();
	const { state }: { state: editPostType | null } = useLocation();
	const [formData, setFormData] = useState<formDataType>({
		/* mongodb do not process apostrophes and commas as humans do, so he.decode helps to fix that */
		title: state !== null ? he.decode(state.title) : "",
		description: state !== null ? he.decode(state.description) : "",
		post: state !== null ? he.decode(state.post) : "",
		author: state !== null ? he.decode(state.author) : "",
		comments: state !== null ? state.comments : [],
		file: state !== null ? state.file : "",
		// if the initial state.post.file value includes metadata for any file stored in the server
		// that filename is saved in a temporal trash state. It will be useful if
		// a new file is uploaded so that we can command the server to delete the old one.
		trash: state !== null ? state.file.filename : ""
	});
	const navigate = useNavigate();

	const handlePostChange = (arg: string): void => {
		setFormData({ ...formData, post: arg });
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value, files } = event.target;
		setFormData({ ...formData, [name]: files?.length ? files[0] : value });
	};

	const [errors, setErrors] = useState({
		title: "",
		description: "",
		post: "",
		author: "",
		file: ""
	});

	type ErrorsArrayType = {
		location: string;
		msg: string;
		path: string;
		type: string;
		value: string;
	};

	function errorHandler(errorsArray: ErrorsArrayType[]) {
		const errorsInitialState = {
			title: "",
			description: "",
			post: "",
			author: "",
			file: ""
		};
		while (errorsArray.length > 0) {
			const error = errorsArray.shift() as ErrorsArrayType;
			switch (error.path) {
				case "title":
					errorsInitialState.title = error.msg;
					break;
				case "description":
					errorsInitialState.description = error.msg;
					break;
				case "post":
					errorsInitialState.post = error.msg;
					break;
				case "author":
					errorsInitialState.author = error.msg;
					break;
				case "file":
					errorsInitialState.file = error.msg;
					break;
				default:
					break;
			}
		}
		setErrors(errorsInitialState);
	}

	async function onSubmit(e: FormEvent) {
		e.preventDefault();

		const jwtToken = localStorage.getItem("accessToken");
		const headers: Record<string, string> = {};

		if (operation === "update") {
			/* the condition bellow fixes unexpected behavior when
			an image file is selected and then deselected,
			to make sure that the file property is always filled,
			since no post without image should be submitted */
			if (formData.file === "") {
				formData.file = state!.file;
			}

			// http://localhost:3000/user/posts/:name
			//https://dummy-blog.adaptable.app/user/posts/:name
			const apiUrl = `http://localhost:3000/user/posts/${name}`;
			if (jwtToken) {
				headers["Authorization"] = `Bearer ${jwtToken}`;
			}

			try {
				const response = await axios.putForm(apiUrl, formData, {
					headers: headers
				});

				if (response.data.errors) {
					const errorsArray = response.data.errors as ErrorsArrayType[];
					errorHandler(errorsArray);
				} else {
					delete response.data.post.post;
					delete response.data.post.comments;
					dispatch(updatePost(response.data.post)); // update global state
					navigate("/");
				}
			} catch (error) {
				const axiosError = error as AxiosError;
				if (
					axiosError?.response?.status === 403 ||
					axiosError?.response?.status === 401
				) {
					// if it's forbidden or unauthorized it will be logged out
					dispatch(switchPrivilege("user")); // logout
					navigate("/log-in");
				} else {
					navigate("/server-error");
				}
			}
		} else {
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

				if (response.data.errors) {
					const errorsArray = response.data.errors as ErrorsArrayType[];
					errorHandler(errorsArray);
				} else {
					delete response.data.post.post;
					delete response.data.post.comments;
					dispatch(addPost(response.data.post)); // update global state
					navigate("/");
				}
			} catch (error) {
				const axiosError = error as AxiosError;

				if (
					axiosError?.response?.status === 403 ||
					axiosError?.response?.status === 401
				) {
					// if it's forbidden or unauthorized it will be logged out
					dispatch(switchPrivilege("user")); // logout
					navigate("/log-in");
				} else {
					navigate("/server-error");
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
									<span className='text-red-600 max-sm:text-xs sm:text-sm'>
										{errors.title}
									</span>
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
									<span className='text-red-600 max-sm:text-xs sm:text-sm'>
										{errors.description}
									</span>
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
									<span className='text-red-600 max-sm:text-xs sm:text-sm'>
										{errors.post}
									</span>
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
									<span className='text-red-600 max-sm:text-xs sm:text-sm'>
										{errors.author}
									</span>
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
										/* accept='image/jpeg, image/png' */
										className='border-2 border-gray-300 p-2 w-full'
										name='file'
										onChange={handleInputChange}
									/>
									<span className='text-red-600 max-sm:text-xs sm:text-sm'>
										{errors.file}
									</span>
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

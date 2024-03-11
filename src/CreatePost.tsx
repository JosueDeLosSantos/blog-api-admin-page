import { FormEvent, useState } from "react";
import axios from "axios";
import { TextField, TextAreaField, FileField } from "./components/Fields";

function CreatePost() {
	const [formData, setFormData] = useState({
		title: "",
		post: "",
		author: "",
		file: null
	});

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
		console.log(JSON.stringify(formData));
		try {
			const response = await axios.post(apiUrl, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${jwtToken}`
				}
			});
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<h1>Create post</h1>
			<form onSubmit={onSubmit} encType='multipart/form-data'>
				<div className='labels-inputs'>
					<TextField
						name='title'
						type='text'
						onInput={handleInputChange}
						value={formData.title}
					>
						Title:
					</TextField>
					<br />
					<TextAreaField
						name='post'
						onChange={handleInputChange}
						value={formData.post}
					>
						Post:
					</TextAreaField>
					<TextField
						name='author'
						type='text'
						onInput={handleInputChange}
						value={formData.author}
					>
						Author:
					</TextField>
					<FileField name='file' onInput={handleInputChange}>
						Image:
					</FileField>
				</div>
				<button type='submit'>Submit</button>
			</form>
		</>
	);
}

export default CreatePost;

/*


{}

 */

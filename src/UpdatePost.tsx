import { FormEvent, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TextField, TextAreaField, FileField } from "./components/Fields";

type formDataType = {
	title: string;
	post: string;
	author: string;
	file: null | File;
	trash: string;
};

function UpdatePost() {
	const { name } = useParams();
	const [trash, setTrash] = useState("");
	const [formData, setFormData] = useState<formDataType>({
		title: "",
		post: "",
		author: "",
		file: null,
		trash: ""
	});

	useEffect(() => {
		(async function getInitalState() {
			const apiUrl = `http://localhost:3000/user/posts/${name}`;
			const jwtToken = localStorage.getItem("accessToken");
			const headers: Record<string, string> = {};
			if (jwtToken) {
				headers["Authorization"] = `Bearer ${jwtToken}`;
			}

			const response = await axios
				.get(apiUrl, {
					headers: {
						Authorization: `Bearer ${jwtToken}`
					}
				})
				.catch((error) => {
					return error;
				});
			console.log(response);

			setFormData(response.data.post);

			if (response.data.post.file.filename) {
				setTrash(response.data.post.file.filename);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { name, value, files } = event.target;
		setFormData({ ...formData, [name]: files?.length ? files[0] : value });
	};

	async function onSubmit(e: FormEvent) {
		e.preventDefault();

		const updateFormData = formData;
		updateFormData.trash = trash;

		// http://localhost:3000/user/sign-up
		//https://dummy-blog.adaptable.app/user/sign-up
		const apiUrl = `http://localhost:3000/user/posts/${name}`;
		const jwtToken = localStorage.getItem("accessToken");
		const headers: Record<string, string> = {};
		if (jwtToken) {
			headers["Authorization"] = `Bearer ${jwtToken}`;
		}
		console.log(JSON.stringify(updateFormData));
		const response = await axios
			.postForm(apiUrl, updateFormData, {
				headers: {
					Authorization: `Bearer ${jwtToken}`
				}
			})
			.catch((error) => {
				return error;
			});
		console.log(response);
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

export default UpdatePost;

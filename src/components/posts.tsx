import { useEffect } from "react";
import axios from "axios";

function Posts() {
	useEffect(() => {
		async function tokenRequest() {
			const jwtToken = localStorage.getItem("accessToken");
			const headers: Record<string, string> = {};
			if (jwtToken) {
				headers["Authorization"] = `Bearer ${jwtToken}`;
			}
			const url = "https://dummy-blog.adaptable.app/user/posts";
			try {
				const response = await axios.get(url, {
					headers: headers
				});

				console.log(response);
			} catch (error) {
				console.log(error);
			}
		}
		tokenRequest();
	}, []);
	return (
		<>
			<h1>Posts</h1>
		</>
	);
}

export default Posts;

import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import Forbidden from "../Forbidden";
import PostsTemplate from "./PostsTemplate";
import axios from "axios";

function Posts() {
	const [state, setState] = useState("loading");
	const [postList, setPostList] = useState(undefined);
	// eslint-disable-next-line react-hooks/rules-of-hooks
	// const navigate = useNavigate();

	useEffect(() => {
		(async function tokenRequest() {
			const jwtToken = localStorage.getItem("accessToken");
			const headers: Record<string, string> = {};
			if (jwtToken) {
				headers["Authorization"] = `Bearer ${jwtToken}`;
			}
			console.log(headers);
			// http://localhost:3000/
			// https://dummy-blog.adaptable.app/user/posts
			const url = "http://localhost:3000/user/posts";
			try {
				const response = await axios.get(url, {
					headers: headers
				});

				console.log(response.data.posts);
				if (response.data.posts.length) {
					setPostList(response.data.posts);
				}
				setState("success");
			} catch (error) {
				console.log(error);
				setState("error");
			}
		})();
	}, []);

	return (
		(state === "loading" && (
			<>
				<Loading />
			</>
		)) ||
		(state === "success" && (
			<>
				<PostsTemplate posts={postList} />
			</>
		)) ||
		(state === "error" && (
			<>
				<Forbidden />
			</>
		))
	);
}

export default Posts;

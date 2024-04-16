import { useEffect, useState } from "react";
import Loading from "../Loading";
import Forbidden from "../Forbidden";
import PostsTemplate from "./PostsTemplate";
import axios from "axios";
import { RootState } from "../../app/rootReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { postsList } from "./postsSlice";

function Posts() {
	const [state, setState] = useState("loading");
	const posts = useSelector((state: RootState) => state.posts);
	const dispatch: AppDispatch = useDispatch();
	// http://localhost:3000/
	// https://dummy-blog.adaptable.app/user/posts
	const server = "http://localhost:3000/";

	useEffect(() => {
		(async function tokenRequest() {
			const jwtToken = localStorage.getItem("accessToken");
			const headers: Record<string, string> = {};
			if (jwtToken) {
				headers["Authorization"] = `Bearer ${jwtToken}`;
			}
			console.log(headers);

			if (!posts.length) {
				(async function fetchPosts() {
					const url = `${server}user/posts`;
					try {
						const response = await axios.get(url, {
							headers: headers
						});

						dispatch(postsList(response.data.posts));

						setState("success");
					} catch (error) {
						setState("error");
					}
				})();
			} else {
				setState("success");
			}
		})();
	}, [posts, dispatch]);

	return (
		(state === "loading" && (
			<>
				<Loading />
			</>
		)) ||
		(state === "success" && (
			<>
				<PostsTemplate server={server} member='admin' posts={posts} />
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

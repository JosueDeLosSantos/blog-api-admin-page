import { useEffect, useState } from "react";
import PostsTemplate from "../features/posts/PostsTemplate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { postsList } from "../features/posts/postsSlice";
import { RootState } from "../app/rootReducer";
import Loading from "../features/Loading";
import Forbidden from "../features/Forbidden";

function Index() {
	const dispatch: AppDispatch = useDispatch();
	const posts = useSelector((state: RootState) => state.posts);
	const [state, setState] = useState("loading");
	// http://localhost:3000/
	// https://dummy-blog.adaptable.app/
	const server = "http://localhost:3000/";
	// request all posts
	useEffect(() => {
		// make an API call only if the state array is empty
		if (!posts.length) {
			(async function fetchPosts() {
				try {
					const response = await fetch(`${server}`, {
						method: "GET"
					});
					const data = await response.json();

					dispatch(postsList(data.posts));
					setState("success");
				} catch (error) {
					setState("error");
				}
			})();
		} else {
			setState("success");
		}
	}, [posts, dispatch]); // only on first render

	return (
		(state === "loading" && (
			<>
				<Loading />
			</>
		)) ||
		(state === "success" && (
			<>
				<PostsTemplate server={server} member='user' posts={posts} />
			</>
		)) ||
		(state === "error" && (
			<>
				<Forbidden />
			</>
		))
	);
}

export default Index;

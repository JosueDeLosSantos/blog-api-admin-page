import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import PostsTemplate from "../features/posts/PostsTemplate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { postsList } from "../features/posts/postsSlice";
import { switchPrivilege } from "../features/posts/privilegeSlice";
import { RootState } from "../app/rootReducer";
import { postTypes } from "../features/posts/types";
import Loading from "../features/Loading";
import ErrorPage from "../features/ErrorPage";

function Index() {
	const dispatch: AppDispatch = useDispatch();
	const posts = useSelector((state: RootState) => state.posts);
	const [loadState, setLoadState] = useState("loading");

	// http://localhost:3000/
	// https://dummy-blog.adaptable.app/
	const server = "http://localhost:3000/";
	// request all posts
	useEffect(() => {
		// make an API call only if the state array is empty
		if (!posts.length) {
			(async function fetchPosts() {
				// get security token
				const jwtToken = localStorage.getItem("accessToken");
				const headers: Record<string, string> = {};
				if (jwtToken) {
					headers["Authorization"] = `Bearer ${jwtToken}`;
				}
				try {
					const response = await axios.get(server, {
						headers: headers // if is admin it will display the list of users
					});

					dispatch(postsList(response.data.posts));
					setLoadState("success");
					dispatch(switchPrivilege("admin"));
					console.log(response);
				} catch (error) {
					console.log(error);
					const axiosError = error as AxiosError;
					if (axiosError.response) {
						// if is not admin it will display the list of users anyway
						if (axiosError.response.status === (401 | 403)) {
							type dataType = {
								posts: postTypes[];
							};
							const userData = axiosError.response.data as dataType;
							dispatch(postsList(userData.posts));
							setLoadState("success");
						}
					} else {
						setLoadState("error");
					}
				}
			})();
		} else {
			setLoadState("success");
		}
	}, [posts, dispatch]); // only on first render

	return (
		(loadState === "loading" && (
			<>
				<Loading />
			</>
		)) ||
		(loadState === "success" && (
			<>
				<PostsTemplate server={server} posts={posts} />
			</>
		)) ||
		(loadState === "error" && (
			<>
				<ErrorPage />
			</>
		))
	);
}

export default Index;

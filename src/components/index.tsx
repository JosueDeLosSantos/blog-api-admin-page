import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import PostsTemplate from "../features/posts/PostsTemplate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { postsList } from "../features/posts/postsSlice";
import { RootState } from "../app/rootReducer";
import { postTypes } from "../features/posts/types";
import Loading from "../features/Loading";
import ErrorPage from "../features/ErrorPage";

function Index() {
	const dispatch: AppDispatch = useDispatch();
	const posts = useSelector((state: RootState) => state.posts);
	const [loadState, setLoadState] = useState("loading");
	const [member, setMember] = useState("user");
	const { state } = useLocation();
	// http://localhost:3000/
	// https://dummy-blog.adaptable.app/
	const server = "http://localhost:3000/";
	// request all posts
	useEffect(() => {
		// get security token
		const jwtToken = localStorage.getItem("accessToken");
		const headers: Record<string, string> = {};
		if (jwtToken) {
			headers["Authorization"] = `Bearer ${jwtToken}`;
		}

		// make an API call only if the state array is empty
		if (!posts.length) {
			(async function fetchPosts() {
				try {
					const response = await axios.get(server, {
						headers: headers
					});

					dispatch(postsList(response.data.posts));
					setLoadState("success");
					setMember("admin");
				} catch (error) {
					const axiosError = error as AxiosError;
					if (axiosError.response) {
						if (axiosError.response.status === 401) {
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
				<PostsTemplate
					server={server}
					member={state !== null ? state : member}
					posts={posts}
				/>
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

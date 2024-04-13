import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import PostTemplate from "../features/posts/PostsTemplate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { postsList } from "../features/posts/postsSlice";
import { RootState } from "../app/rootReducer";

function Index() {
	const dispatch: AppDispatch = useDispatch();
	const posts = useSelector((state: RootState) => state.posts);
	const [postList, setPostList] = useState(undefined);
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
					console.log(data.posts);
					dispatch(postsList(data.posts));
					if (data.posts.length) {
						setPostList(data.posts);
					}
				} catch (error) {
					console.error(error);
				}
			})();
		} else {
			console.log(posts);
			if (posts.length) {
				setPostList(posts);
			}
		}
	}, [posts, dispatch]); // only on first render

	return (
		<>
			<PostTemplate server={server} member='user' posts={postList} />
		</>
	);
}

export default Index;

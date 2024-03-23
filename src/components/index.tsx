import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { postsList } from "../features/posts/postsSlice";
import { RootState } from "../app/rootReducer";

function Index() {
	const dispatch: AppDispatch = useDispatch();
	const posts = useSelector((state: RootState) => state.posts);
	// request all posts
	useEffect(() => {
		// make an API call only if the state array is empty
		if (!posts.length) {
			(async function fetchPosts() {
				try {
					// http://localhost:3000/
					// https://dummy-blog.adaptable.app/
					const response = await fetch("http://localhost:3000/", {
						method: "GET"
					});
					const data = await response.json();
					console.log(data.posts);
					dispatch(postsList(data.posts));
				} catch (error) {
					console.error(error);
				}
			})();
		} else {
			console.log(posts);
		}
	}, [posts, dispatch]); // only on first render

	return (
		<>
			<h1>Hello world</h1>
			<button type='button'>
				<Link to='sign-up'>Sign up</Link>
			</button>
			<button type='button'>
				<Link to='log-in'>Log in</Link>
			</button>
		</>
	);
}

export default Index;

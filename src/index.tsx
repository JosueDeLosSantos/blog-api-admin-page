import { useEffect } from "react";
import { Link } from "react-router-dom";

function Index() {
	// request all posts
	useEffect(() => {
		(async function fetchPosts() {
			try {
				// http://localhost:3000/
				// https://dummy-blog.adaptable.app/
				const response = await fetch("http://localhost:3000/", {
					method: "GET"
				});
				const data = await response.json();
				console.log(data);
			} catch (error) {
				console.error(error);
			}
		})();
	}, []); // only on first render

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

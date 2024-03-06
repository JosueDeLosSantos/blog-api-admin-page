import { useEffect } from "react";
import { Link } from "react-router-dom";

function Index() {
	// request all posts
	useEffect(() => {
		(async function fetchPosts() {
			try {
				const response = await fetch("https://dummy-blog.adaptable.app/", {
					method: "GET",
					mode: "no-cors",
				});
				const data = await response.json();
				console.log(data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		})();
	}, []); // only on first render

	return (
		<>
			<h1>Hello world</h1>
			<button type='button'>
				<Link to='user/sign-up'>Sign up</Link>
			</button>
		</>
	);
}

export default Index;

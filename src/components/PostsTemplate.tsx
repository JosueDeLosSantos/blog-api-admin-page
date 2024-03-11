import { Link } from "react-router-dom";

function PostTemplate() {
	return (
		<>
			<h1>Post</h1>
			<br />
			<Link to='create'>Create post</Link>
		</>
	);
}

export default PostTemplate;

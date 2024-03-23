import { Link } from "react-router-dom";

function Forbidden() {
	return (
		<div>
			<h1>We are sorry!</h1>
			<p>
				you are logged out. <Link to='/log-in'>Log in</Link> if you want to be
				able to manage your posts or go to the <Link to='/'>home</Link> page to
				see all posts.
			</p>
		</div>
	);
}

export default Forbidden;

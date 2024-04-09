import { Link } from "react-router-dom";
import MenuBar from "../../components/MenuBar";
// import he from "he"; // decodes mongodb encoded HTML

export type BlogPost = {
	_id: string;
	title: string;
	description: string;
	post: string;
	date: string;
	author: string;
	comments: string;
	file: {
		filename: string;
		originalname: string;
		mimetype: string;
		path: string;
		size: number;
	};
	__v: number;
};

function PostTemplate({
	member,
	posts
}: {
	member: string;
	posts: BlogPost[] | undefined;
}) {
	return (
		<div>
			<MenuBar member={member} />
			<h1>Posts</h1>
			<ul>
				{posts !== undefined &&
					posts.map((post) => (
						<li key={post._id}>
							<h2>{post.title}</h2>
							<p>{post.description}</p>
							<p>{post.date}</p>
							<p>{post.author}</p>

							{
								// <div
								// 	dangerouslySetInnerHTML={{
								// 		__html: he.decode(post.post) // renders decoded HTML
								// 	}}
								// />
							}
						</li>
					))}
			</ul>
			<br />
			{member === "user" && (
				<p>
					if you want to create a post, <Link to='log-in'>Log in</Link> first.
				</p>
			)}
		</div>
	);
}

export default PostTemplate;

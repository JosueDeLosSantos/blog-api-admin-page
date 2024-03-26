import { Link } from "react-router-dom";
//import he from "he"; // decodes mongodb encoded HTML

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

function PostTemplate({ posts }: { posts: BlogPost[] | undefined }) {
	return (
		<div>
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
			<Link to='create'>Create post</Link>
		</div>
	);
}

export default PostTemplate;

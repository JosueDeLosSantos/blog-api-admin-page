import { Link } from "react-router-dom";
import MenuBar from "../../components/MenuBar";
import { ReactElement, useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";
// import he from "he"; // decodes mongodb encoded HTML

/* 

	// 	dangerouslySetInnerHTML={{
	// 		__html: he.decode(post.post) // renders decoded HTML
	// 	}}
	// />
*/

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
	server,
	member,
	posts
}: {
	server: string;
	member: string;
	posts: BlogPost[] | undefined;
}) {
	console.log(posts);
	const listImgRef = useRef(Array(posts.length).fill(null));
	const [color, setColor] = useState({});

	useEffect(() => {
		/* returns color white or black depending on the image dominant color */
		function contraster(img: ReactElement) {
			const colorThief = new ColorThief();
			const color = colorThief.getColor(img); // dominant color
			const brightness = Math.round(
				(parseInt(color[0]) * 299 +
					parseInt(color[1]) * 587 +
					parseInt(color[2]) * 114) /
					1000
			);
			const textColor = brightness > 125 ? "text-black" : "text-white";
			return textColor;
		}

		const tempColor: Record<string, string> = {};

		listImgRef.current.forEach((element) => {
			tempColor[element.id] = contraster(element);
		});

		setColor(tempColor);
	}, []);

	return (
		<div>
			<MenuBar member={member} />

			<div className='mt-10'>
				{posts !== undefined &&
					posts.map((post, index) => (
						<div
							className='max-w-screen-lg mx-auto flex flex-col md:flex-col lg:flex-row  w-3/4 p-2 sm:gap-2 md:gap-4'
							key={post._id}
						>
							<div className='w-full md:w-full lg:w-1/2 relative'>
								{post.file !== null && (
									<img
										ref={(el) => (listImgRef.current[index] = el)}
										id={post._id}
										className='w-full max-h-72 object-cover'
										src={`${server}${post.file.path}`}
										crossOrigin='anonymous'
										alt=''
									/>
								)}
								<div
									className={`${
										color[post._id]
									} absolute bottom-0 left-0 lg:hidden`}
								>
									<h2>{post.title}</h2>
								</div>
							</div>
							<div className='w-full md:w-full  lg:w-1/2'>
								<h2 className='hidden lg:block text-xl sm:text-1xl md:text-2xl lg:text-3xl mt-1 mb-2'>
									{post.title}
								</h2>
								<span className='text-xs sm:text-sm md:text-base'>
									{post.date}
								</span>
								<div>
									<p className='text-sm sm:text-base md:text-lg lg:text-xl'>
										{post.description}
									</p>
								</div>
							</div>
						</div>
					))}
			</div>
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

import { Link } from "react-router-dom";
import MenuBar from "../../components/MenuBar";
import { useEffect, useRef, useState } from "react";
import { postTypes } from "./types";
import ColorThief from "colorthief";
import he from "he"; // decodes mongodb encoded HTML

/* 

	// 	dangerouslySetInnerHTML={{
	// 		__html: he.decode(post.post) // renders decoded HTML
	// 	}}
	// />
*/

function PostsTemplate({
	server,
	member,
	posts
}: {
	server: string;
	member: string;
	posts: postTypes[];
}) {
	console.log(posts);
	const listImgRef = useRef(Array(posts?.length).fill(null));
	const colorPlaceHolderf: Record<string, string> = {};
	const [color, setColor] = useState(colorPlaceHolderf);

	useEffect(() => {
		/* returns color white or black depending on the image dominant color */
		function contraster(img: HTMLImageElement) {
			const colorThief = new ColorThief();
			const color = colorThief.getColor(img); // dominant color
			const brightness = Math.round(
				(parseInt(color[0].toString()) * 299 +
					parseInt(color[1].toString()) * 587 +
					parseInt(color[2].toString()) * 114) /
					1000
			);
			const textColor =
				brightness > 125
					? "text-black drop-shadow-[1px_-1px_rgba(247,247,247)]"
					: "text-white drop-shadow-[1px_-1px_rgba(0,0,0)]";
			return textColor;
		}

		/* the following function assigns a white color or black color 
		to the title of all images. ex: if img is dark title's color will 
		be white and if img is light title's color will be black */
		async function contrastLoader() {
			const tempColor: Record<string, string> = {};

			listImgRef.current.forEach((element) => {
				tempColor[element.id] = contraster(element);
			});

			setColor(tempColor);
		}
		contrastLoader();
	}, []);

	return (
		<div>
			<MenuBar member={member} />

			<div className='mt-10'>
				{/* the condition below ensures that all posts and the list of
				 colors for titles be ready before rendering */}
				{(posts && Object.keys(color).length) !== (undefined && false) &&
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
									<h2>{he.decode(post.title)}</h2>
								</div>
							</div>
							<div className='w-full md:w-full  lg:w-1/2'>
								<h2 className='hidden lg:block text-xl sm:text-1xl md:text-2xl lg:text-3xl mt-1 mb-2'>
									{he.decode(post.title)}
								</h2>
								<span className='text-xs sm:text-sm md:text-base'>
									{post.date}
								</span>
								<div>
									<p className='text-sm sm:text-base md:text-lg lg:text-xl'>
										{he.decode(post.description)}
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

export default PostsTemplate;

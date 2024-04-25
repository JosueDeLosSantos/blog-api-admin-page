import { Link } from "react-router-dom";
import MenuBar from "../MenuBar";
import { SyntheticEvent, useRef } from "react";
import { postTypes } from "./types";
import ColorThief from "colorthief";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
	const listImgRef = useRef(Array(posts?.length).fill(null));

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
				? {
						color: "black",
						// text outline effect
						shadow: "1px -1px 0 white, -1px 1px 0 white, -1px -1px 0 white, 1px 1px 0 white"
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  }
				: {
						color: "white",
						// text outline effect
						shadow: "1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black, -1px -1px 0 black"
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  };
		return textColor;
	}

	console.log("iteration");

	function setTitleColor(e: SyntheticEvent<HTMLImageElement, Event>) {
		const image = e.target as HTMLImageElement;
		listImgRef.current.forEach((element, index) => {
			if (element.dataset.imgid === image.id) {
				listImgRef.current[index].style.color = contraster(image).color;
				listImgRef.current[index].style.textShadow = contraster(image).shadow;
			}
		});
	}

	const parentRef = useRef(Array(posts?.length).fill(null));
	const navigate = useNavigate();

	const postClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		parentRef.current.forEach((el) => {
			// Check if the clicked element is the parent element (or a child of it)
			if (el && el.contains(e.target)) {
				(async function fetchPost() {
					const server = `http://localhost:3000/user/posts/${el.id}`;
					const response = await axios.get(server);
					// console.log(response.data.post);
					navigate(`/posts/post/${el.id}`, {
						state: { post: response.data.post, member: member }
					});
				})();
			}
		});
	};

	return (
		<div>
			<MenuBar member={member} />

			<div className='mt-10'>
				{posts &&
					posts.map((post, index) => (
						<div
							id={post._id}
							ref={(el) => (parentRef.current[index] = el)}
							onClick={(e) => postClick(e)}
							className='max-w-screen-lg mx-auto mb-5 flex flex-col md:flex-col lg:flex-row  w-3/4 p-2 sm:gap-1 md:gap-2 lg:gap-4'
							key={post._id}
						>
							<div className='w-full md:w-full lg:w-1/2 relative'>
								{post.file !== null && (
									<img
										onLoad={(e) => setTitleColor(e)}
										id={post._id}
										className='w-full max-h-40 sm:mx-h-60 md:max-h-64 lg:max-h-72 object-cover'
										src={`${server}${post.file.path}`}
										crossOrigin='anonymous'
										alt=''
									/>
								)}
								<div
									ref={(el) => (listImgRef.current[index] = el)}
									data-imgid={post._id}
									className={`absolute bottom-0 left-1 lg:hidden`}
								>
									<h2 className='max-sm:text-xl'>
										{he.decode(post.title)}
									</h2>
								</div>
							</div>
							<div className='w-full md:w-full  lg:w-1/2'>
								<h2 className='hidden lg:block text-xl sm:text-1xl md:text-2xl lg:text-3xl mt-1 mb-2'>
									{he.decode(post.title)}
								</h2>
								<span className='text-xs sm:text-sm md:text-base lg:text-lg text-gray-500 italic'>
									{post.date}
								</span>
								<div>
									<p className='text-lg sm:text-xl md:text-1xl lg:text-2xl max-lg:mt-0'>
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

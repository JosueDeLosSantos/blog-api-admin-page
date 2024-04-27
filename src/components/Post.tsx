import { useLocation, useNavigate } from "react-router-dom";
import MenuBar from "../features/MenuBar";
import { IconButton } from "@mui/material";
import CommentsBox from "../features/CommentsBox";
import { onePostType } from "../features/posts/types";
import he from "he"; // decodes mongodb encoded HTML
import { useState, useEffect } from "react";
import ForumIcon from "@mui/icons-material/Forum";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Badge from "@mui/material/Badge";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, grey } from "@mui/material/colors";

const theme = createTheme({
	palette: {
		primary: {
			main: red[500]
		},
		secondary: {
			main: grey[900]
		},
		info: {
			main: grey[50]
		}
	}
});

type stateType = {
	post: onePostType;
	member: string;
};

type commentType = {
	_id: string;
	comment: string;
	date: string;
	email: string;
	name: string;
	post: string;
	__v: number;
};

function Post() {
	const { state }: { state: stateType } = useLocation();
	const [comments, setComments] = useState(state.post.comments);

	// keep comments array updated to avoid unnecessary API calls
	function commentsAction(arg: commentType) {
		// Change array's order to show the most recent one on the top
		setComments([arg, ...comments]);
	}

	// this method is more effective than useRef for scrolling into view
	// though is less React friendly
	function ScrollTo(v: string) {
		const commentsSection = document.getElementById("comments-box");
		const postsSection = document.getElementById("post-header");
		if (commentsSection && postsSection) {
			window.scrollTo({
				top:
					v === "comments"
						? commentsSection?.offsetTop
						: postsSection?.offsetTop,
				behavior: "smooth"
			});
		}
	}

	const navigate = useNavigate();

	// Redirect admin to the post's edition page
	function EditPost(postToEdit: onePostType) {
		navigate(`/posts/update/${postToEdit._id}`, { state: postToEdit });
	}

	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		// Add event listener
		window.addEventListener("resize", handleResize);

		// Remove event listener on cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div className='bg-slate-100'>
			<MenuBar member={state.member} />
			<main className='pl-5 pr-5 pb-5 pt-20 flex gap-4'>
				{/* <Box>
					<AppBar
						className='bg-blue-300 w-10 h-screen shadow-none border border-solid border-slate-200'
						position='fixed'
					></AppBar>
				</Box> */}

				{state.member === "admin" && (
					<ThemeProvider theme={theme}>
						<div
							className={
								windowWidth > 770
									? "pt-10 w-fit h-screen fixed flex flex-col gap-8"
									: "bg-white p-2 fixed bottom-0 left-0 w-screen shadow-[0px_-0.5px_5px_rgb(148,163,184)] flex justify-around"
							}
						>
							<div>
								<IconButton onClick={() => ScrollTo("comments")}>
									<Badge badgeContent={comments.length} color='primary'>
										<ForumOutlinedIcon
											fontSize='medium'
											color='secondary'
										/>
									</Badge>
								</IconButton>
							</div>
							<div>
								<IconButton onClick={() => EditPost(state.post)}>
									<EditIcon fontSize='medium' color='secondary' />
								</IconButton>
							</div>
							<div>
								<IconButton>
									<DeleteIcon fontSize='medium' color='secondary' />
								</IconButton>
							</div>
							<div>
								<IconButton onClick={() => ScrollTo("posts")}>
									<KeyboardArrowUpIcon
										fontSize='medium'
										color='secondary'
									/>
								</IconButton>
							</div>
						</div>
					</ThemeProvider>
				)}

				<article className='bg-white sm:max-lg:w-9/12 mx-auto rounded-lg pb-3 border border-solid border-slate-200'>
					<header id='post-header'>
						<div
							className='md:mb-0 w-full  mx-auto relative'
							style={{ height: "24em" }}
						>
							<div
								className='absolute left-0 bottom-0 w-full h-full z-10'
								style={{
									backgroundImage:
										"linear-gradient(180deg,transparent,rgba(0,0,0,.7))"
								}}
							></div>
							<img
								src={`http://localhost:3000/${state.post.file.path}`}
								className='absolute left-0 top-0 w-full h-full z-0 object-cover rounded-lg'
							/>
							<div className='p-4 absolute bottom-0 left-0 z-20'>
								<h2 className='text-3xl sm:text-4xl font-semibold text-gray-100 leading-tight'>
									{he.decode(state.post.title)}
								</h2>
								<div className='flex mt-3'>
									<div>
										<p className='font-semibold text-gray-200 text-sm'>
											{" "}
											{he.decode(state.post.author)}{" "}
										</p>
										<p className='font-semibold text-gray-400 text-xs'>
											{" "}
											{he.decode(state.post.date)}{" "}
										</p>
									</div>
								</div>
							</div>
						</div>
					</header>
					{/* Post's content */}
					<div
						className='max-w-screen-md border-b-[0.5px] border-t-0 border-l-0 border-r-0 border-solid border-slate-200 mx-auto sm:mt-5 md:mt-8 p-5'
						dangerouslySetInnerHTML={{
							__html: he.decode(state.post.post) // renders decoded HTML
						}}
					/>
					{/* Comment's box */}
					<CommentsBox
						commentsAction={commentsAction}
						post_id={`${state.post._id}`}
					/>
					<div id='comments-box' className='max-w-screen-md mx-auto'>
						{comments.map((comment) => (
							<div className='box-border w-11/12 mb-8 mx-auto border-solid border border-slate-300 p-5 rounded-lg'>
								<div className='flex gap-2 items-end h-5 mb-5'>
									<div className='text-slate-500 text-sm'>
										{comment.name}
									</div>
									<div className='text-slate-400 text-4xl'>
										<div>.</div>
									</div>
									<div className='text-slate-500 text-sm'>
										{comment.date}
									</div>
								</div>
								<div className='text-base'>
									{he.decode(comment.comment)}
								</div>
							</div>
						))}
					</div>
				</article>
			</main>
			{state.member === "user" && (
				<span onClick={() => ScrollTo("comments")}>
					<div className='p-3 bg-neutral-950 w-fit rounded-full fixed bottom-5 left-5'>
						<ThemeProvider theme={theme}>
							<Badge badgeContent={comments.length} color='primary'>
								<ForumIcon fontSize='large' color='info' />
							</Badge>
						</ThemeProvider>
					</div>
				</span>
			)}
		</div>
	);
}

export default Post;

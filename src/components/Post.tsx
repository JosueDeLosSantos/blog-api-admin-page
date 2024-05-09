import { useLocation, useNavigate } from "react-router-dom";
import MenuBar from "../features/MenuBar";
import { IconButton } from "@mui/material";
import CommentsBox from "../features/CommentsBox";
import { onePostType } from "../features/posts/types";
import { deletePost } from "../features/posts/postsSlice";
import axios from "axios";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { RootState } from "../app/rootReducer";

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
	const dispatch: AppDispatch = useDispatch();
	const member = useSelector((state: RootState) => state.privilege);
	const { state }: { state: stateType } = useLocation();
	const [comments, setComments] = useState(state.post.comments);
	const navigate = useNavigate();

	// position the scroll at the top of the page
	window.scrollTo(0, 0);

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

	// Redirect admin to the post's edition page
	function EditPost(postToEdit: onePostType) {
		navigate(`/posts/update/${postToEdit._id}`, { state: postToEdit });
	}

	const handleDeletePost = async (postId: string) => {
		// http://localhost:3000/user/posts
		//https://dummy-blog.adaptable.app/user/posts
		const API_URL = "http://localhost:3000/user/posts";
		// get security token
		const jwtToken = localStorage.getItem("accessToken");
		const headers: Record<string, string> = {};
		if (jwtToken) {
			headers["Authorization"] = `Bearer ${jwtToken}`;
		}
		try {
			const response = await axios.delete(`${API_URL}/${postId}`, {
				headers: headers
			});

			dispatch(deletePost(response.data.post._id)); // update global state
			navigate("/", { state: "admin" });
		} catch (error) {
			navigate("/server-error");
		}
	};

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
			<MenuBar />
			<main className='pl-5 pr-5 pb-5 pt-24 flex gap-4'>
				{member === "admin" && (
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
								<IconButton
									onClick={() => handleDeletePost(state.post._id)}
								>
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
						{comments.map((comment, i) => (
							<div
								key={i}
								className='box-border w-11/12 mb-8 mx-auto border-solid border border-slate-300 p-5 rounded-lg'
							>
								<div className='max-[370px]:flex-col max-[370px]:gap-0 flex gap-2 items-end h-5 mb-5'>
									<div className='max-sm:text-xs sm:text-sm text-slate-500'>
										{comment.name}
									</div>
									<div className='max-[370px]:hidden max-sm:text-2xl sm:text-4xl text-slate-400 '>
										<div>.</div>
									</div>
									<div className='max-sm:text-[0.70rem] max-sm:leading-[1.390] sm:text-[0.80rem] sm:leading-snug text-slate-500'>
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
			{member === "user" && (
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

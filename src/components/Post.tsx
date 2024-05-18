import { Link, useNavigate } from "react-router-dom";
import MenuBar from "../features/MenuBar";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CommentsBox from "../features/CommentsBox";
import { onePostType } from "../features/posts/types";
import he from "he"; // decodes mongodb encoded HTML
import { useState, useEffect, useRef } from "react";
import ForumIcon from "@mui/icons-material/Forum";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Badge from "@mui/material/Badge";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, grey } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { switchPrivilege } from "../features/posts/privilegeSlice";
import { RootState } from "../app/rootReducer";
import axios, { AxiosError } from "axios";
import { deletePost } from "../features/posts/postsSlice";

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

export type commentType = {
	_id: string;
	comment: string;
	author: string;
	date: string;
	email: string;
	name: string;
	post: string;
	__v: number;
};

function Post() {
	const dispatch: AppDispatch = useDispatch();
	const member = useSelector((state: RootState) => state.privilege);
	const initialPost = null as unknown as onePostType;
	const [post, setPost] = useState<onePostType>(initialPost);
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);
	const [commentToEdit, setCommentToEdit] = useState<commentType>({
		_id: "",
		comment: "",
		author: "",
		name: "",
		email: "",
		date: "",
		post: "",
		__v: 0
	});

	// position the scroll at the top of the page
	// window.scrollTo(0, 0);

	// keep comments array updated to avoid unnecessary API calls
	function addComment(arg: commentType) {
		// Change array's order to show the most recent one on the top
		if (post) {
			setPost({ ...post, comments: [arg, ...post.comments] });
		}
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

	type userType = {
		email: string;
		exp: number;
		first_name: string;
		iat: number;
		last_name: string;
		username: string;
		__v: number;
		_id: string;
	};
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	const [user, setUser] = useState<userType>({} as userType);

	// MARK: fetch post
	useEffect(() => {
		(async function fetchPost() {
			const url = window.location.href;
			const urlId = url.split("/")[5];
			const jwtToken = localStorage.getItem("accessToken");
			const headers: Record<string, string> = {};
			if (jwtToken) {
				headers["Authorization"] = `Bearer ${jwtToken}`;
			}
			try {
				const server = `http://localhost:3000/user/posts/${urlId}`;
				const response = await axios.get(server, {
					headers: headers
				});

				dispatch(switchPrivilege("admin"));
				setUser(response.data.user);
				setPost(response.data.post);
				setCommentToEdit({ ...commentToEdit, post: response.data.post._id });
			} catch (error) {
				const axiosError = error as AxiosError;

				if (
					axiosError?.response?.status === 403 ||
					axiosError?.response?.status === 401
				) {
					type userPostType = { post: onePostType };
					const userData = axiosError?.response?.data as userPostType;
					dispatch(switchPrivilege("user"));
					setPost(userData.post);
				} else {
					navigate("/server-error");
				}
			}
		})();

		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		// Add event listener
		window.addEventListener("resize", handleResize);

		// Remove event listener on cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// MARK: Edit post
	// Redirect admin to the post's edition page
	function EditPost(postToEdit: onePostType) {
		const postWithFormattedComments = {
			...postToEdit,
			comments: postToEdit.comments.map((comment) => {
				return comment._id;
			})
		};
		// console.log(postWithFormattedComments);
		navigate(`/posts/update/${postToEdit._id}`, { state: postWithFormattedComments });
	}
	// MARK: Delete post
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
			navigate("/");
		} catch (error) {
			const axiosError = error as AxiosError;
			if (
				axiosError?.response?.status === 403 ||
				axiosError?.response?.status === 401
			) {
				// if it's forbidden or unauthorized it will be logged out
				dispatch(switchPrivilege("user")); // logout
				navigate("/log-in");
			} else {
				navigate("/server-error");
			}
		}
	};

	const deleteRef = useRef(Array(post?.comments.length).fill(null));
	const editRef = useRef(Array(post?.comments.length).fill(null));

	const handleDeletion = (e: React.MouseEvent<HTMLButtonElement>) => {
		const target = e.target as HTMLButtonElement;
		// console.log(target);
		deleteRef.current.forEach((el) => {
			if (el && el.contains(target)) {
				deleteComment(el.dataset.deleteid);
			}
		});
		// deleteComment(target.id);
	};
	const handleEdition = (e: React.MouseEvent<HTMLButtonElement>) => {
		const target = e.target as HTMLButtonElement;

		editRef.current.forEach((el) => {
			if (el && el.contains(target)) {
				editComment(el.dataset.editid);
			}
		});
		// editComment(el.dataset.editid);
	};

	// MARK: edit comment
	function editComment(commentId: string) {
		const selectedComment = post.comments.filter(
			(comment) => comment._id === commentId
		)[0];
		setIsEditing(true);
		setCommentToEdit(selectedComment);
		console.log(selectedComment);

		const commentsBoxSection = document.getElementById("edit-comment-box");
		window.scrollTo({
			top: commentsBoxSection?.offsetTop,
			behavior: "smooth"
		});
	}

	// MARK: delete comment

	async function deleteComment(commentId: string) {
		const apiUrl = `http://localhost:3000/user/comments/${commentId}`;
		try {
			const jwtToken = localStorage.getItem("accessToken");
			const headers: Record<string, string> = {};
			if (jwtToken) {
				headers["Authorization"] = `Bearer ${jwtToken}`;
			}
			const response = await axios.delete(apiUrl, {
				headers: headers
			});
			setPost(response.data.post);
		} catch (error) {
			const axiosError = error as AxiosError;

			if (
				axiosError?.response?.status === 403 ||
				axiosError?.response?.status === 401
			) {
				navigate("/log-in");
			} else {
				navigate("/server-error");
			}
		}
	}

	return (
		<div className='bg-slate-100 min-h-screen'>
			{/* MARK: Toolbar */}
			<MenuBar />
			<main className='pl-5 pr-5 pb-5 pt-24 flex gap-4'>
				{member === "admin" && (
					<ThemeProvider theme={theme}>
						<div
							className={
								windowWidth > 770
									? "pt-10 w-fit h-screen fixed flex flex-col gap-8"
									: "bg-white z-50 p-2 fixed bottom-0 left-0 w-screen shadow-[0px_-0.5px_5px_rgb(148,163,184)] flex justify-around"
							}
						>
							<div>
								<IconButton onClick={() => ScrollTo("comments")}>
									<Badge
										badgeContent={post?.comments.length}
										color='primary'
									>
										<ForumOutlinedIcon
											fontSize='medium'
											color='secondary'
										/>
									</Badge>
								</IconButton>
							</div>
							{post && (
								<div>
									<IconButton onClick={() => EditPost(post)}>
										<EditIcon fontSize='medium' color='secondary' />
									</IconButton>
								</div>
							)}
							{post && (
								<div>
									<IconButton
										onClick={() => handleDeletePost(post._id)}
									>
										<DeleteIcon fontSize='medium' color='secondary' />
									</IconButton>
								</div>
							)}
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
					{/* MARK: Post's header */}
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
								src={`http://localhost:3000/${post?.file.path}`}
								className='absolute left-0 top-0 w-full h-full z-0 object-cover rounded-lg'
							/>
							<div className='p-4 absolute bottom-0 left-0 z-20'>
								<h2 className='text-3xl sm:text-4xl font-semibold text-gray-100 leading-tight'>
									{post?.title && he.decode(post.title)}
								</h2>
								<div className='flex mt-3'>
									<div>
										<p className='font-semibold text-gray-200 text-sm'>
											{" "}
											{post?.author && he.decode(post?.author)}{" "}
										</p>
										<p className='font-semibold text-gray-400 text-xs'>
											{" "}
											{post?.date && he.decode(post?.date)}{" "}
										</p>
									</div>
								</div>
							</div>
						</div>
					</header>
					{/* MARK: Post's content */}
					{post?.post && (
						<div
							className='prose max-w-screen-md border-b-[0.5px] border-t-0 border-l-0 border-r-0 border-solid border-slate-200 mx-auto sm:mt-5 md:mt-8 p-5'
							dangerouslySetInnerHTML={{
								__html: he.decode(post.post) // renders decoded HTML
							}}
						/>
					)}

					{/* Comment's box */}
					{member === "admin" && post?.post && (
						<CommentsBox
							formData={commentToEdit}
							setFormData={setCommentToEdit}
							setIsEditing={setIsEditing}
							isEditing={isEditing}
							addComment={addComment}
							post_id={`${post._id}`}
						/>
					)}
					<div id='comments-box' className='max-w-screen-md mx-auto'>
						{post?.comments?.length > 0 && (
							<div className='text-center mx-auto'>
								<h2>Comments</h2>
							</div>
						)}

						{member === "user" && (
							<div className='mx-auto w-11/12 pt-5 pr-5 pl-5 pb-10 text-slate-600'>
								If you want to leave a comment{" "}
								<Link
									className='text-slate-800 font-bold no-underline'
									to='/log-in'
								>
									Log in
								</Link>
							</div>
						)}
						{/* MARK: Comments */}
						{post?.comments.map((comment, index) => (
							<div
								key={comment._id}
								className='box-border w-11/12 mb-8 mx-auto border-solid border border-slate-300 p-5 rounded-lg'
							>
								<div className='flex-col flex sm:gap-2 items-start sm:flex-row h-5 mb-5 relative'>
									<div className='max-sm:text-xs sm:text-sm text-slate-500'>
										{comment.name}
									</div>
									<div className='relative bottom-5 max-sm:hidden max-sm:text-2xl sm:text-4xl text-slate-400'>
										.
									</div>
									<div className='max-sm:text-[0.70rem] sm:self-center max-sm:leading-[1.390] sm:text-[0.80rem] sm:leading-snug text-slate-500'>
										{comment.date}
									</div>
									{member === "admin" && (
										<div className='absolute flex flex-row-reverse top-[-15px] right-[-15px]'>
											<IconButton
												ref={(el) =>
													(deleteRef.current[index] = el)
												}
												data-deleteid={comment._id}
												data-author={comment.author}
												onClick={handleDeletion}
											>
												<DeleteIcon fontSize='small' />
											</IconButton>
											{comment.author === user._id && (
												<IconButton
													ref={(el) =>
														(editRef.current[index] = el)
													}
													data-editid={comment._id}
													data-author={comment.author}
													onClick={handleEdition}
												>
													<EditIcon fontSize='small' />
												</IconButton>
											)}
										</div>
									)}
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
							{post?.comments && (
								<Badge
									badgeContent={post.comments.length}
									color='primary'
								>
									<ForumIcon fontSize='large' color='info' />
								</Badge>
							)}
						</ThemeProvider>
					</div>
				</span>
			)}
		</div>
	);
}

export default Post;

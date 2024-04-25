import { useLocation } from "react-router-dom";
import MenuBar from "../features/MenuBar";
import CommentsBox from "../features/CommentsBox";
import { onePostType } from "../features/posts/types";
import he from "he"; // decodes mongodb encoded HTML
import { useState } from "react";

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
		setComments([...comments, arg]);
		// next challenge: sort them to show the most recent one
	}

	return (
		<div>
			<MenuBar member={state.member} />
			<main>
				<article>
					<header>
						<div
							className='mb-4 mt-10 md:mb-0 w-full max-w-screen-md mx-auto relative'
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
								className='absolute left-0 top-0 w-full h-full z-0 object-cover'
							/>
							<div className='p-4 absolute bottom-0 left-0 z-20'>
								<h2 className='text-4xl font-semibold text-gray-100 leading-tight'>
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
						className='max-w-screen-md mx-auto sm:mt-5 md:mt-8 pb-5'
						dangerouslySetInnerHTML={{
							__html: he.decode(state.post.post) // renders decoded HTML
						}}
					/>
					{/* Comment's box */}
					<CommentsBox
						commentsAction={commentsAction}
						post_id={`${state.post._id}`}
					/>
					<div className='max-w-screen-md mx-auto'>
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
		</div>
	);
}

export default Post;

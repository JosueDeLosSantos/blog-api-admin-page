import { useLocation } from "react-router-dom";
import MenuBar from "../features/MenuBar";
import he from "he"; // decodes mongodb encoded HTML

function Post() {
	const { state } = useLocation();
	console.log(state);
	return (
		<div>
			<MenuBar member={state.member} />
			<main>
				<article>
					<header className='w-full'>
						<div
							className='mb-4 md:mb-0 w-full max-w-screen-md mx-auto relative'
							style={{ height: "24em" }}
						>
							<div
								className='absolute left-0 bottom-0 w-full h-full z-10'
								style={{
									backgroundImage:
										"linear-gradient(180deg,transparent,rgba(0,0,0,.7))"
								}} //'background-image: linear-gradient(180deg,transparent,rgba(0,0,0,.7));'
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
				</article>
			</main>
		</div>
	);
}

export default Post;

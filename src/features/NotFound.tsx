import { Link } from "react-router-dom";

function NotFound() {
	return (
		<>
			<div>
				<div className='text-center mt-[25vh]'>
					<h1 className='text-4xl sm:text-7xl font-medium'>404</h1>
					<p className='text-xl sm:text-3xl font-medium m-6'>
						Sorry, the page you're looking for can't be found.
					</p>

					<Link
						to='/'
						className='bg-slate-800 hover:bg-slate-700 no-underline text-white sm:text-2xl py-2 px-4 rounded'
					>
						Go Home
					</Link>
				</div>
			</div>
		</>
	);
}

export default NotFound;

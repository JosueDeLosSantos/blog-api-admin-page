function ServerError() {
	return (
		<>
			<div>
				<div className='text-center mt-[25vh]'>
					<h1 className='text-3xl sm:text-5xl font-medium'>Server Error</h1>
					<p className='text-xl sm:text-3xl font-medium m-6'>
						Sorry, we are having issues with our server.
					</p>

					<a
						href='https://github.com/JosueDeLosSantos'
						className='bg-slate-800 hover:bg-slate-700 no-underline text-white sm:text-2xl py-2 px-4 rounded'
					>
						Contact administrator
					</a>
				</div>
			</div>
		</>
	);
}

export default ServerError;

import { AppBar, Box, IconButton, Menu, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useEffect } from "react";

function SkeletonPostsPage() {
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
	}, []); // Empty array ensures effect is only run on mount and unmount

	return (
		<div className='bg-slate-100 min-h-screen max-h-auto'>
			<Box>
				<AppBar
					className='bg-white shadow-none border border-solid border-slate-200'
					position='fixed'
				>
					<Toolbar>
						<IconButton
							size='large'
							edge='start'
							aria-label='menu'
							sx={{ mr: 2, color: "black" }}
						>
							<MenuIcon fontSize={windowWidth > 350 ? "large" : "medium"} />
						</IconButton>
						<Menu
							id='basic-menu'
							open={false}
							elevation={1}
							MenuListProps={{
								"aria-labelledby": "basic-button"
							}}
						></Menu>
						<Typography
							variant='h6'
							component='div'
							className='text-center w-full font-PressStart2P mx-sm:text-xl lg:text-3xl'
							sx={{
								color: "black"
							}}
						>
							{"<JCODER>"}
						</Typography>
					</Toolbar>
				</AppBar>
			</Box>
			<div className='w-fit mx-auto pt-24'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						className='max-w-screen-lg mx-5 mb-2 border border-solid border-slate-200 flex flex-col md:flex-col lg:flex-row p-2 sm:gap-1 md:gap-2 lg:gap-4 bg-white rounded-lg'
						key={i}
					>
						<div className='w-full md:w-full lg:w-1/2 relative'>
							{/* fake image */}
							<div className='size-40 sm:size-60 md:min-h-64 md:min-w-96 lg:min-h-72 lg:min-w-96 bg-custom-animation-1'></div>

							<div className={`absolute bottom-2 left-1 lg:hidden`}>
								<div className='bg-white rounded-full max-sm:h-3 sm:h-4 md:h-5 w-[9.5rem] sm:w-[14.5rem] md:w-[23.5rem] max-lg:bg-white'></div>
							</div>
						</div>
						<div className='w-full md:w-full  lg:w-1/2'>
							<div className='rounded-full hidden lg:block w-96 h-10 mt-1 mb-2 bg-custom-animation-2'></div>
							<div className='rounded-full max-sm:mt-1 h-2 w-20 sm:h-3 sm:w-24 md:w-44 md:h-4 lg:w-52 lg:h-5 bg-custom-animation-1'></div>
							<div className='mt-3 sm:mt-4 md:mt-5 lg:mt-8'>
								{Array.from({ length: 5 }).map((_, i) => (
									<div
										key={i}
										className='rounded-full h-2 w-[9.5rem] sm:h-3 sm:w-[14.5rem] md:h-4 md:w-[23.5rem] lg:h-5 lg:w-96 bg-custom-animation-1 my-1'
									></div>
								))}
							</div>
							<div className='rounded-full h-2 w-20 sm:h-3 sm:w-24 md:h-4 md:w-44 lg:h-5 lg:w-44 bg-custom-animation-1 my-1'></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default SkeletonPostsPage;

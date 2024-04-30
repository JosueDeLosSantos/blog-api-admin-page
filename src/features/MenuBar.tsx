import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { switchPrivilege } from "./posts/privilegeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/rootReducer";
import { AppDispatch } from "../app/store";

export default function MenuBar() {
	const dispatch: AppDispatch = useDispatch();
	const member = useSelector((state: RootState) => state.privilege);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const navigate = useNavigate();
	const handleClose = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		const { innerText } = target;

		switch (innerText) {
			case "Logout":
				dispatch(switchPrivilege("user"));
				navigate("/");
				break;
			case "Login":
				navigate("/log-in");
				break;
			case "Sign Up":
				navigate("/sign-up");
				break;
			case "Create post":
				navigate("/posts/create");
				break;
			case "All post":
				navigate("/");
				break;
			default:
				setAnchorEl(null);
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
	}, []); // Empty array ensures effect is only run on mount and unmount

	return (
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
						onClick={handleClick}
						sx={{ mr: 2, color: "black" }}
					>
						<MenuIcon fontSize={windowWidth > 350 ? "large" : "medium"} />
					</IconButton>
					<Menu
						id='basic-menu'
						anchorEl={anchorEl}
						open={open}
						elevation={1}
						onClose={handleClose}
						MenuListProps={{
							"aria-labelledby": "basic-button"
						}}
					>
						{member && (
							<MenuItem
								sx={{
									fontSize: "1rem",
									borderBottom: "1px solid #e0e0e0" // Add a bottom border to each menu item
								}}
								onClick={(e) => handleClose(e)}
							>
								All post
							</MenuItem>
						)}
						{member === "admin" && (
							<MenuItem
								sx={{
									fontSize: "1rem",
									borderBottom: "1px solid #e0e0e0" // Add a bottom border to each menu item
								}}
								onClick={(e) => handleClose(e)}
							>
								Create post
							</MenuItem>
						)}
						{member === "user" && (
							<MenuItem
								sx={{
									fontSize: "1rem",
									borderBottom: "1px solid #e0e0e0" // Add a bottom border to each menu item
								}}
								onClick={(e) => handleClose(e)}
							>
								Login
							</MenuItem>
						)}
						{member === "user" && (
							<MenuItem
								sx={{
									fontSize: "1rem"
								}}
								onClick={(e) => handleClose(e)}
							>
								Sign Up
							</MenuItem>
						)}
						{member === "admin" && (
							<MenuItem
								sx={{
									fontSize: "1rem"
								}}
								onClick={(e) => handleClose(e)}
							>
								Logout
							</MenuItem>
						)}
					</Menu>
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
	);
}

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MenuBar({ member }: { member: string }) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const navigate = useNavigate();
	const handleClose = (e: MouseEvent) => {
		const { innerText } = e.target;

		switch (innerText) {
			case "Logout":
				localStorage.removeItem("accessToken");
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
			default:
				setAnchorEl(null);
		}
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position='static'>
				<Toolbar>
					<IconButton
						size='large'
						edge='start'
						color='inherit'
						aria-label='menu'
						onClick={handleClick}
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
					<Menu
						id='basic-menu'
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							"aria-labelledby": "basic-button"
						}}
					>
						{/* options change depending on the member */}
						{/* {member === "admin" ? (
							<MenuItem onClick={handleClose}>Logout</MenuItem>
						) : (
							<MenuItem onClick={handleClose}>LogIn</MenuItem>
						)} */}

						{member === "admin" && (
							<MenuItem onClick={handleClose}>Logout</MenuItem>
						)}
						{member === "admin" && (
							<MenuItem onClick={handleClose}>Create post</MenuItem>
						)}
						{member === "user" && (
							<MenuItem onClick={handleClose}>Login</MenuItem>
						)}
						{member === "user" && (
							<MenuItem onClick={handleClose}>Sign Up</MenuItem>
						)}
					</Menu>
					<Typography
						variant='h6'
						component='div'
						className='text-center w-full'
					>
						JCODER
					</Typography>
				</Toolbar>
			</AppBar>
		</Box>
	);
}

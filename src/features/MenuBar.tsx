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
import { switchPrivilege } from "./posts/privilegeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/rootReducer";
import { AppDispatch } from "../app/store";
import useWindowSize from "../features/windowSize";

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

    switch (target.dataset.menuitem) {
      case "0": // Home
        navigate("/");
        break;
      case "1": // All Posts
        navigate("/posts");
        break;
      case "2": // Create post
        navigate("/posts/create");
        break;
      case "3": // Login
        navigate("/log-in");
        break;
      case "4": // Sign Up
        navigate("/sign-up");
        break;
      case "5": // Logout
        dispatch(switchPrivilege("user"));
        localStorage.removeItem("accessToken");
        navigate("/posts");
        break;
      default:
        setAnchorEl(null);
    }
  };

  // MARK: return

  const { windowWidth } = useWindowSize();

  return (
    <Box>
      <AppBar
        className="border border-solid border-slate-200 bg-white shadow-none dark:border-slate-900 dark:bg-slate-800"
        position="fixed"
      >
        <Toolbar>
          <IconButton
            className="icons"
            size="large"
            edge="start"
            aria-label="menu"
            onClick={handleClick}
            sx={{ mr: 2, color: "black" }}
          >
            <MenuIcon fontSize={windowWidth >= 640 ? "large" : "medium"} />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            elevation={1}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {member === "user" && (
              <MenuItem
                data-menuitem="0"
                sx={{
                  fontSize: "1rem",
                  borderBottom: "1px solid #e0e0e0",
                }}
                onClick={(e) => handleClose(e)}
              >
                Home
              </MenuItem>
            )}
            {member && (
              <MenuItem
                data-menuitem="1"
                sx={{
                  fontSize: "1rem",
                  borderBottom: "1px solid #e0e0e0", // Add a bottom border to each menu item
                }}
                onClick={(e) => handleClose(e)}
              >
                All Posts
              </MenuItem>
            )}
            {member === "admin" && (
              <MenuItem
                data-menuitem="2"
                sx={{
                  fontSize: "1rem",
                  borderBottom: "1px solid #e0e0e0", // Add a bottom border to each menu item
                }}
                onClick={(e) => handleClose(e)}
              >
                Create Post
              </MenuItem>
            )}
            {member === "user" && (
              <MenuItem
                data-menuitem="3"
                sx={{
                  fontSize: "1rem",
                  borderBottom: "1px solid #e0e0e0", // Add a bottom border to each menu item
                }}
                onClick={(e) => handleClose(e)}
              >
                Login
              </MenuItem>
            )}
            {member === "user" && (
              <MenuItem
                data-menuitem="4"
                sx={{
                  fontSize: "1rem",
                }}
                onClick={(e) => handleClose(e)}
              >
                Sign Up
              </MenuItem>
            )}
            {member === "admin" && (
              <MenuItem
                data-menuitem="5"
                sx={{
                  fontSize: "1rem",
                }}
                onClick={(e) => handleClose(e)}
              >
                Logout
              </MenuItem>
            )}
          </Menu>
          <Typography
            variant="h6"
            component="div"
            className="logo w-full text-center font-PressStart2P text-xs sm:text-sm"
            sx={{
              color: "#721ea3",
            }}
          >
            {"<JCODER>"}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

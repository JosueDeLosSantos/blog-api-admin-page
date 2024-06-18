import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { switchPrivilege } from "../modules/posts/utils/privilegeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/rootReducer";
import { AppDispatch } from "../app/store";
import useWindowSize from "../hooks/windowSize";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// Icons
import LaptopIcon from "@mui/icons-material/Laptop";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

export default function MenuBar() {
  const dispatch: AppDispatch = useDispatch();
  const member = useSelector((state: RootState) => state.privilege);
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const navigate = useNavigate();

  const homePage = () => {
    navigate("/");
  };

  const allPost = () => {
    navigate("/posts");
  };

  const createPost = () => {
    navigate("/posts/create");
  };

  const signIn = () => {
    navigate("/log-in");
  };

  const signUp = () => {
    navigate("/sign-up");
  };

  const profile = () => {
    navigate("/profile");
  };

  const signOut = () => {
    dispatch(switchPrivilege("user"));
    localStorage.removeItem("accessToken");
    navigate("/posts");
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {member === "user" && (
          <ListItem onClick={homePage} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HomeOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem onClick={allPost} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <DynamicFeedOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={"All Posts"} />
          </ListItemButton>
        </ListItem>
        {member === "admin" && (
          <ListItem onClick={createPost} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <EditNoteOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={"Create Post"} />
            </ListItemButton>
          </ListItem>
        )}
        {member === "user" && (
          <ListItem onClick={signUp} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HowToRegOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={"Sign Up"} />
            </ListItemButton>
          </ListItem>
        )}
        {member === "user" && (
          <>
            <Divider />
            <ListItem onClick={signIn} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <VpnKeyOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={"Sign In"} />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {member === "admin" && (
          <ListItem onClick={profile} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AccountCircleOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={"Profile"} />
            </ListItemButton>
          </ListItem>
        )}
        {member === "admin" && (
          <>
            <Divider />
            <ListItem onClick={signOut} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <LogoutOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={"Sign Out"} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

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
            onClick={toggleDrawer(true)}
            sx={{ mr: 2, color: "black" }}
          >
            <MenuIcon fontSize={windowWidth >= 640 ? "large" : "medium"} />
          </IconButton>

          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
          <Typography
            variant="h6"
            component="div"
            className="w-full text-center font-PressStart2P text-xs text-purple-700 sm:text-sm dark:text-purple-300"
          >
            {"<JCODER>"}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

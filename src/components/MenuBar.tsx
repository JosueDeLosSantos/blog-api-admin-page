import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { switchPrivilege } from "../utils/privilegeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/rootReducer";
import { AppDispatch } from "../app/store";
import useWindowSize from "../hooks/windowSize";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// Icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function MenuBar() {
  const dispatch: AppDispatch = useDispatch();
  const member = useSelector((state: RootState) => state.privilege);
  const location = useLocation();
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

  const about = () => {
    navigate("/about");
  };

  const signOut = () => {
    dispatch(switchPrivilege("user"));
    localStorage.removeItem("accessToken");
    navigate("/posts");
  };

  const DrawerList = (
    <Box
      className="drawer"
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        {member === "user" && (
          <ListItem
            className="drawer-list-item"
            onClick={homePage}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                <HomeOutlinedIcon className="drawerContent" />
              </ListItemIcon>
              <ListItemText className="drawerContent" primary={"Home"} />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem
          className={`drawer-list-item ${location.pathname === "/posts" && "menu-item-selected"}`}
          onClick={allPost}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              <DynamicFeedOutlinedIcon className="drawerContent" />
            </ListItemIcon>
            <ListItemText className="drawerContent" primary={"All Posts"} />
          </ListItemButton>
        </ListItem>
        {member === "admin" && (
          <ListItem
            className={`drawer-list-item ${location.pathname === "/posts/create" && "menu-item-selected"}`}
            onClick={createPost}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                <EditNoteOutlinedIcon className="drawerContent" />
              </ListItemIcon>
              <ListItemText className="drawerContent" primary={"Create Post"} />
            </ListItemButton>
          </ListItem>
        )}
        {member === "user" && (
          <ListItem
            className="drawer-list-item"
            onClick={signUp}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                <HowToRegOutlinedIcon className="drawerContent" />
              </ListItemIcon>
              <ListItemText className="drawerContent" primary={"Sign Up"} />
            </ListItemButton>
          </ListItem>
        )}
        {member === "user" && (
          <ListItem
            className="drawer-list-item"
            onClick={signIn}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                <VpnKeyOutlinedIcon className="drawerContent" />
              </ListItemIcon>
              <ListItemText className="drawerContent" primary={"Sign In"} />
            </ListItemButton>
          </ListItem>
        )}
        {member === "admin" && (
          <ListItem
            className={`drawer-list-item ${location.pathname === "/profile" && "menu-item-selected"}`}
            onClick={profile}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                <AccountCircleOutlinedIcon className="drawerContent" />
              </ListItemIcon>
              <ListItemText className="drawerContent" primary={"Profile"} />
            </ListItemButton>
          </ListItem>
        )}
        {member === "admin" && (
          <ListItem
            className="drawer-list-item"
            onClick={signOut}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                <LogoutOutlinedIcon className="drawerContent" />
              </ListItemIcon>
              <ListItemText className="drawerContent" primary={"Sign Out"} />
            </ListItemButton>
          </ListItem>
        )}
        {member && (
          <ListItem
            className={`drawer-list-item ${location.pathname === "/about" && "menu-item-selected"}`}
            onClick={about}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                <InfoOutlinedIcon className="drawerContent" />
              </ListItemIcon>
              <ListItemText className="drawerContent" primary={"About"} />
            </ListItemButton>
          </ListItem>
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
            sx={{ color: "black" }}
          >
            <MenuIcon fontSize={windowWidth >= 640 ? "large" : "medium"} />
          </IconButton>

          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
          <Typography
            variant="h6"
            component="div"
            className="mobile-logo w-fit font-PressStart2P text-sm text-purple-500 sm:text-sm dark:text-purple-400"
          >
            {"<JCODER>"}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

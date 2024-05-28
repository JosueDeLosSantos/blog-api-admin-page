import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { switchPrivilege } from "./posts/privilegeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/rootReducer";
import { AppDispatch } from "../app/store";

export default function MenuBar() {
  const dispatch: AppDispatch = useDispatch();
  const member = useSelector((state: RootState) => state.privilege);

  const navigate = useNavigate();
  const handleClick = (e: MouseEvent) => {
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
        navigate("/posts");
    }
  };

  // MARK: return

  return (
    <Box>
      <AppBar
        className="border border-solid border-slate-200 bg-white shadow-none dark:border-slate-900 dark:bg-slate-800"
        position="fixed"
      >
        <Toolbar className="flex justify-between">
          <div className="logo mx-sm:text-xl font-PressStart2P text-[#721ea3] lg:text-2xl">
            {"<JCODER>"}
          </div>
          <div className="flex min-w-[75%] items-center justify-between divide-x divide-y-0 divide-solid text-center text-black xl:text-lg dark:divide-slate-50 dark:text-slate-100">
            {member === "user" && (
              <div
                data-menuitem="0"
                className="w-fit flex-1 cursor-pointer font-bold hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={(e) => handleClick(e)}
              >
                Home
              </div>
            )}
            {member && (
              <div
                data-menuitem="1"
                className="w-fit flex-1 cursor-pointer font-bold hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={(e) => handleClick(e)}
              >
                All Posts
              </div>
            )}
            {member === "admin" && (
              <div
                data-menuitem="2"
                className="w-fit flex-1 cursor-pointer font-bold hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={(e) => handleClick(e)}
              >
                Create Post
              </div>
            )}
            {member === "user" && (
              <div
                data-menuitem="3"
                className="w-fit flex-1 cursor-pointer font-bold hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={(e) => handleClick(e)}
              >
                Login
              </div>
            )}
            {member === "user" && (
              <div
                data-menuitem="4"
                className="w-fit flex-1 cursor-pointer font-bold hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={(e) => handleClick(e)}
              >
                Sign Up
              </div>
            )}
            {member === "admin" && (
              <div
                data-menuitem="5"
                className="w-fit flex-1 cursor-pointer font-bold hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={(e) => handleClick(e)}
              >
                Logout
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

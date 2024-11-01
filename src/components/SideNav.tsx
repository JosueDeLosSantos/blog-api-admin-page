import { useNavigate } from "react-router-dom";
import { switchPrivilege } from "../utils/privilegeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/rootReducer";
import { AppDispatch } from "../app/store";

// Icons
import LaptopIcon from "@mui/icons-material/Laptop";
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
    navigate("/posts");
  };

  // MARK: return

  return (
    <div className="sticky top-0 flex h-screen w-1/5 flex-col border border-solid border-slate-200 bg-white p-2 shadow-none dark:border-slate-900 dark:bg-slate-800">
      <div className="flex h-1/5 items-center justify-center rounded bg-blue-100 text-center font-PressStart2P text-purple-700 dark:bg-purple-500 dark:text-purple-100">
        <LaptopIcon />
        {"<JCODER>"}
      </div>
      <div className="flex flex-col justify-between text-black dark:text-slate-100">
        {member === "user" && (
          <div
            className="mt-2 flex w-full cursor-pointer items-center rounded bg-slate-100 p-2 font-medium hover:bg-purple-600 hover:text-white dark:bg-slate-700 dark:hover:bg-blue-100 dark:hover:text-purple-600"
            onClick={homePage}
          >
            <HomeOutlinedIcon /> <span className="ml-2">Home</span>
          </div>
        )}
        {member && (
          <div
            className={`mt-2 flex w-full cursor-pointer items-center rounded p-2 font-medium hover:bg-purple-600 hover:text-white dark:hover:bg-blue-100 dark:hover:text-purple-600 ${(location.pathname === "/posts" && "bg-blue-100 text-purple-700 dark:bg-purple-500  dark:text-purple-100") || "bg-slate-100  dark:bg-slate-700 "}`}
            onClick={allPost}
          >
            <DynamicFeedOutlinedIcon />
            <span className="ml-2">All Posts</span>
          </div>
        )}

        {member === "admin" && (
          <div
            className={`mt-2 flex w-full cursor-pointer items-center rounded p-2 font-medium hover:bg-purple-600 hover:text-white dark:hover:bg-blue-100 dark:hover:text-purple-700 ${(location.pathname === "/posts/create" && "bg-blue-100 text-purple-700 dark:bg-purple-500  dark:text-purple-100") || "bg-slate-100  dark:bg-slate-700 "}`}
            onClick={createPost}
          >
            <EditNoteOutlinedIcon />
            <span className="ml-2">Create Post</span>
          </div>
        )}

        {member === "user" && (
          <>
            <div
              className="mt-2 flex w-full cursor-pointer items-center rounded bg-slate-100 p-2 font-medium hover:bg-purple-600 hover:text-white dark:bg-slate-700 dark:hover:bg-blue-100 dark:hover:text-purple-700"
              onClick={signUp}
            >
              <HowToRegOutlinedIcon />
              <span className="ml-2">Sign Up</span>
            </div>
          </>
        )}

        {member === "user" && (
          <div
            className="mt-2 flex w-full cursor-pointer items-center rounded bg-slate-100 p-2 font-medium hover:bg-purple-600 hover:text-white dark:bg-slate-700 dark:hover:bg-blue-100 dark:hover:text-purple-700"
            onClick={signIn}
          >
            <VpnKeyOutlinedIcon />
            <span className="ml-2">Sing In</span>
          </div>
        )}
        {member === "admin" && (
          <>
            <div
              className={`mt-2 flex w-full cursor-pointer items-center rounded p-2 font-medium hover:bg-purple-600 hover:text-white dark:hover:bg-blue-100 dark:hover:text-purple-700 ${(location.pathname === "/profile" && "bg-blue-100 text-purple-700 dark:bg-purple-500  dark:text-purple-100") || "bg-slate-100  dark:bg-slate-700 "}`}
              onClick={profile}
            >
              <AccountCircleOutlinedIcon />
              <span className="ml-2">Profile</span>
            </div>
          </>
        )}

        {member === "admin" && (
          <div
            className="mt-2 flex w-full cursor-pointer items-center rounded bg-slate-100 p-2 font-medium hover:bg-purple-600 hover:text-white dark:bg-slate-700 dark:hover:bg-blue-100 dark:hover:text-purple-700"
            onClick={signOut}
          >
            <LogoutOutlinedIcon />
            <span className="ml-2">Sign Out</span>
          </div>
        )}

        {member && (
          <>
            <div
              className={`mt-2 flex w-full cursor-pointer items-center rounded p-2 font-medium hover:bg-purple-600 hover:text-white dark:hover:bg-blue-100 dark:hover:text-purple-700 ${(location.pathname === "/about" && "bg-blue-100 text-purple-700 dark:bg-purple-500  dark:text-purple-100") || "bg-slate-100  dark:bg-slate-700 "}`}
              onClick={about}
            >
              <InfoOutlinedIcon />
              <span className="ml-2">About</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

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

  const signOut = () => {
    dispatch(switchPrivilege("user"));
    localStorage.removeItem("accessToken");
    navigate("/posts");
  };

  // MARK: return

  return (
    <div className="sticky top-0 flex h-screen w-1/5 flex-col border border-solid border-slate-200 bg-white p-2 shadow-none dark:border-slate-900 dark:bg-slate-800">
      <div className="flex h-1/5 items-center justify-center rounded bg-purple-100 text-center font-PressStart2P text-purple-700 dark:bg-purple-700 dark:text-purple-100">
        <LaptopIcon />
        {"<JCODER>"}
      </div>
      <div className="flex flex-col justify-between text-black xl:text-lg dark:text-slate-100">
        {member === "user" && (
          <div
            data-menuitem="0"
            className="mt-2 flex w-full cursor-pointer items-center rounded bg-slate-100 p-2 font-medium hover:bg-purple-700 hover:text-white dark:bg-slate-700 dark:hover:bg-purple-100 dark:hover:text-purple-700"
            onClick={homePage}
          >
            <HomeOutlinedIcon /> <span className="ml-2">Home</span>
          </div>
        )}
        {member && (
          <div
            data-menuitem="1"
            className={`mt-2 flex w-full cursor-pointer items-center rounded p-2 font-medium hover:bg-purple-700 hover:text-white dark:hover:bg-purple-100 dark:hover:text-purple-700 ${(location.pathname === "/posts" && "bg-purple-100 text-purple-700 dark:bg-purple-700  dark:text-purple-100") || "bg-slate-100  dark:bg-slate-700 "}`}
            onClick={allPost}
          >
            <DynamicFeedOutlinedIcon data-menuitem="1" />
            <span data-menuitem="1" className="ml-2">
              All Posts
            </span>
          </div>
        )}
        {member === "admin" && (
          <div
            data-menuitem="2"
            className={`mt-2 flex w-full cursor-pointer items-center rounded p-2 font-medium hover:bg-purple-700 hover:text-white dark:hover:bg-purple-100 dark:hover:text-purple-700 ${(location.pathname === "/posts/create" && "bg-purple-100 text-purple-700 dark:bg-purple-700  dark:text-purple-100") || "bg-slate-100  dark:bg-slate-700 "}`}
            onClick={createPost}
          >
            <EditNoteOutlinedIcon
              data-menuitem="2"
              sx={{ fontSize: "1.7rem" }}
            />
            <span data-menuitem="2" className="ml-2">
              Create Post
            </span>
          </div>
        )}

        {member === "user" && (
          <>
            <div
              data-menuitem="4"
              className="mt-2 flex w-full cursor-pointer items-center rounded bg-slate-100 p-2 font-medium hover:bg-purple-700 hover:text-white dark:bg-slate-700 dark:hover:bg-purple-100 dark:hover:text-purple-700"
              onClick={signUp}
            >
              <HowToRegOutlinedIcon data-menuitem="4" />
              <span data-menuitem="4" className="ml-2">
                Sign Up
              </span>
            </div>
            <div className="sidebar-empty-space mt-2 flex w-full rounded bg-slate-100 dark:bg-slate-700"></div>
          </>
        )}
        {member === "user" && (
          <div
            data-menuitem="3"
            className="mt-2 flex w-full cursor-pointer items-center rounded bg-slate-100 p-2 font-medium hover:bg-purple-700 hover:text-white dark:bg-slate-700 dark:hover:bg-purple-100 dark:hover:text-purple-700"
            onClick={signIn}
          >
            <VpnKeyOutlinedIcon data-menuitem="3" sx={{ fontSize: "1.2rem" }} />
            <span data-menuitem="3" className="ml-2">
              Sing In
            </span>
          </div>
        )}
        {member === "admin" && (
          <>
            <div
              data-menuitem="5"
              className={`mt-2 flex w-full cursor-pointer items-center rounded p-2 font-medium hover:bg-purple-700 hover:text-white dark:hover:bg-purple-100 dark:hover:text-purple-700 ${(location.pathname === "/profile" && "bg-purple-100 text-purple-700 dark:bg-purple-700  dark:text-purple-100") || "bg-slate-100  dark:bg-slate-700 "}`}
              onClick={profile}
            >
              <AccountCircleOutlinedIcon data-menuitem="5" />
              <span data-menuitem="5" className="ml-2">
                Profile
              </span>
            </div>
            <div className="sidebar-empty-space mt-2 flex w-full rounded bg-slate-100 dark:bg-slate-700"></div>
          </>
        )}

        {member === "admin" && (
          <div
            data-menuitem="6"
            className="mt-2 flex w-full cursor-pointer items-center rounded bg-slate-100 p-2 font-medium hover:bg-purple-700 hover:text-white dark:bg-slate-700 dark:hover:bg-purple-100 dark:hover:text-purple-700"
            onClick={signOut}
          >
            <LogoutOutlinedIcon data-menuitem="6" />
            <span data-menuitem="6" className="ml-2">
              Sign Out
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

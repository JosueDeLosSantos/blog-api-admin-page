import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Posts from "../pages/Posts";
import Navbar from "../pages/Navbar";
import CreateUpdatePost from "../pages/CreateUpdatePost";
import NotFound from "../pages/NotFound";
import Post from "../pages/Post";
import ServerError from "../pages/ServerError";
import LogIn from "../pages/log-in";
import SignUp from "../pages/sign-up";
import Hero from "../pages/Hero";
import Profile from "../pages/Profile";

const Router = () => {
  //https://dummy-blog.adaptable.app/
  const server = "http://localhost:3000/";

  // MARK: Router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Hero />,
    },
    {
      path: "/",
      element: <Navbar />,
      children: [
        {
          path: "profile",
          element: <Profile server={server} />,
        },
        {
          path: "posts",
          element: <Posts server={server} />,
        },
        {
          path: "posts/post/:name",
          element: <Post server={server} />,
        },
        {
          path: "posts/create",
          element: <CreateUpdatePost server={server} operation="create" />,
        },
        {
          path: "posts/update/:name",
          element: <CreateUpdatePost server={server} operation="update" />,
        },
        {
          path: "server-error",
          element: <ServerError />,
        },
      ],
      errorElement: <NotFound />,
    },
    {
      path: "log-in",
      element: <LogIn server={server} />,
    },
    {
      path: "sign-up",
      element: <SignUp server={server} />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;

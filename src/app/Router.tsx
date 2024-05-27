import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Posts from "../components/Posts";
import Home from "../components/Home";
import User from "../components/user";
import CreateUpdatePost from "../components/CreateUpdatePost";
import NotFound from "../features/NotFound";
import Post from "../components/Post";
import ServerError from "../features/ServerError";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <NotFound />,
    },
    {
      path: "posts",
      element: <Posts />,
    },
    {
      path: "server-error",
      element: <ServerError />,
    },
    {
      path: ":name",
      element: <User />,
    },
    {
      path: "posts/create",
      element: <CreateUpdatePost operation="create" />,
    },
    {
      path: "posts/update/:name",
      element: <CreateUpdatePost operation="update" />,
    },
    {
      path: "posts/post/:name",
      element: <Post />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;

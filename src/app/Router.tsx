import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Posts from "../components/Posts";
import Home from "../components/Home";
import User from "../components/user";
import CreateUpdatePost from "../components/CreateUpdatePost";
import NotFound from "../features/NotFound";
import Post from "../components/Post";
import ServerError from "../features/ServerError";

// POSTS
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { postsList } from "../features/posts/postsSlice";
import { switchPrivilege } from "../features/posts/privilegeSlice";
import { RootState } from "../app/rootReducer";
import { postTypes } from "../features/posts/types";
import axios, { AxiosError } from "axios";
import { useEffect } from "react";

const Router = () => {
  // MARK: posts preloader
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts);

  // http://localhost:3000/
  // https://dummy-blog.adaptable.app/
  const server = "http://localhost:3000/";

  useEffect(() => {
    // make an API call only if the state array is empty
    if (!posts.length) {
      (async function fetchPosts() {
        // get security token
        const jwtToken = localStorage.getItem("accessToken");
        const headers: Record<string, string> = {};
        if (jwtToken) {
          headers["Authorization"] = `Bearer ${jwtToken}`;
        }
        try {
          const response = await axios.get(server, {
            headers: headers,
          });

          dispatch(switchPrivilege("admin"));

          if (response.data.posts) {
            dispatch(postsList(response.data.posts));
          }
        } catch (error) {
          const axiosError = error as AxiosError;

          if (
            axiosError?.response?.status === 403 ||
            axiosError?.response?.status === 401
          ) {
            type dataType = {
              posts: postTypes[];
            };
            const userData = axiosError?.response?.data as dataType;

            if (userData.posts) {
              dispatch(postsList(userData.posts));
            }
          }
        }
      })();
    }
  }, [posts, dispatch]);

  // MARK: Router
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

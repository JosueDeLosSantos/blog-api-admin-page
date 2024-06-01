import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import PostsTemplate from "../modules/posts/components/PostsTemplate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { postsList } from "../modules/posts/utils/postsSlice";
import { switchPrivilege } from "../modules/posts/utils/privilegeSlice";
import { RootState } from "../app/rootReducer";
import { postTypes } from "../modules/posts/types";
import SkeletonPostsPage from "./SkeletonPostsPage";
import ServerError from "./ServerError";

function Index() {
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts);
  const [loadState, setLoadState] = useState("loading");

  // http://localhost:3000/
  // https://dummy-blog.adaptable.app/
  const server = "http://localhost:3000/";
  // MARK: get posts
  // request all posts
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
          setLoadState("success");
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
            setLoadState("success");
          } else {
            setLoadState("error");
          }
        }
      })();
    } else {
      setLoadState("success");
    }
  }, [posts, dispatch]);
  // MARK: render
  return (
    (loadState === "loading" && (
      <>
        <SkeletonPostsPage />
      </>
    )) ||
    (loadState === "success" && (
      <>
        <PostsTemplate server={server} posts={posts} />
      </>
    )) ||
    (loadState === "error" && (
      <>
        <ServerError />
      </>
    ))
  );
}

export default Index;

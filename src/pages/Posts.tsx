import { useEffect, useState } from "react";
import axios from "axios";
import PostsTemplate from "../components/PostsTemplate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { postsList } from "../utils/postsSlice";
import { switchPrivilege } from "../utils/privilegeSlice";
import { RootState } from "../app/rootReducer";
import SkeletonPostsPage from "./SkeletonPostsPage";
import ServerError from "./ServerError";

function Index({ server }: { server: string }) {
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts);
  const [loadState, setLoadState] = useState("loading");

  // MARK: get posts
  useEffect(() => {
    // make an API call only if the state array is empty

    (async function fetchPosts() {
      try {
        const response = await axios.get(server);

        // get security token
        const jwtToken = localStorage.getItem("accessToken");
        if (jwtToken) {
          dispatch(switchPrivilege("admin"));
        }

        dispatch(postsList(response.data.posts));
        setLoadState("success");
      } catch (error) {
        setLoadState("error");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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

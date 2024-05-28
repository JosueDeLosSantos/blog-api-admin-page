import { Link, useNavigate } from "react-router-dom";
import MenuBar from "../features/MenuBar";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CommentsBox from "../features/CommentsBox";
import { onePostType } from "../features/posts/types";
import he from "he"; // decodes mongodb encoded HTML
import { useState, useEffect, useRef } from "react";
import ForumIcon from "@mui/icons-material/Forum";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Badge from "@mui/material/Badge";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, grey } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { switchPrivilege } from "../features/posts/privilegeSlice";
import { RootState } from "../app/rootReducer";
import axios, { AxiosError } from "axios";
import { deletePost } from "../features/posts/postsSlice";
import useWindowSize from "../features/windowSize";
import MenuBarLarge from "../features/MenuBarLarge";

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
    secondary: {
      main: grey[900],
    },
    info: {
      main: grey[50],
    },
  },
});

export type commentType = {
  _id: string;
  comment: string;
  author: string;
  date: string;
  email: string;
  name: string;
  post: string;
  __v: number;
};

function Post() {
  const dispatch: AppDispatch = useDispatch();
  const member = useSelector((state: RootState) => state.privilege);
  const initialPost = null as unknown as onePostType;
  const [post, setPost] = useState<onePostType>(initialPost);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState<commentType>({
    _id: "",
    comment: "",
    author: "",
    name: "",
    email: "",
    date: "",
    post: "",
    __v: 0,
  });

  // position the scroll at the top of the page
  // window.scrollTo(0, 0);

  // keep comments array updated to avoid unnecessary API calls
  function addComment(arg: commentType) {
    // Change array's order to show the most recent one on the top
    if (post) {
      setPost({ ...post, comments: [arg, ...post.comments] });
    }
  }

  // this method is more effective than useRef for scrolling into view
  // though is less React friendly
  function ScrollTo(v: string) {
    const commentsSection = document.getElementById("comments-box");
    const postsSection = document.getElementById("post-header");
    if (commentsSection && postsSection) {
      window.scrollTo({
        top:
          v === "comments"
            ? commentsSection?.offsetTop
            : postsSection?.offsetTop,
        behavior: "smooth",
      });
    }
  }

  type userType = {
    email: string;
    exp: number;
    first_name: string;
    iat: number;
    last_name: string;
    username: string;
    __v: number;
    _id: string;
  };

  const [user, setUser] = useState<userType>({} as userType);

  // MARK: fetch post
  useEffect(() => {
    (async function fetchPost() {
      const url = window.location.href;
      const urlId = url.split("/")[5];
      const jwtToken = localStorage.getItem("accessToken");
      const headers: Record<string, string> = {};
      if (jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
      }
      try {
        const server = `http://localhost:3000/user/posts/${urlId}`;
        const response = await axios.get(server, {
          headers: headers,
        });

        dispatch(switchPrivilege("admin"));
        setUser(response.data.user);
        setPost(response.data.post);
        setCommentToEdit({ ...commentToEdit, post: response.data.post._id });
      } catch (error) {
        const axiosError = error as AxiosError;

        if (
          axiosError?.response?.status === 403 ||
          axiosError?.response?.status === 401
        ) {
          type userPostType = { post: onePostType };
          const userData = axiosError?.response?.data as userPostType;
          dispatch(switchPrivilege("user"));
          setPost(userData.post);
        } else {
          navigate("/server-error");
        }
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // MARK: Edit post
  // Redirect admin to the post's edition page
  function EditPost(postToEdit: onePostType) {
    const postWithFormattedComments = {
      ...postToEdit,
      comments: postToEdit.comments.map((comment) => {
        return comment._id;
      }),
    };
    // console.log(postWithFormattedComments);
    navigate(`/posts/update/${postToEdit._id}`, {
      state: postWithFormattedComments,
    });
  }
  // MARK: Delete post
  const handleDeletePost = async (postId: string) => {
    // http://localhost:3000/user/posts
    //https://dummy-blog.adaptable.app/user/posts
    const API_URL = "http://localhost:3000/user/posts";
    // get security token
    const jwtToken = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};
    if (jwtToken) {
      headers["Authorization"] = `Bearer ${jwtToken}`;
    }
    try {
      const response = await axios.delete(`${API_URL}/${postId}`, {
        headers: headers,
      });

      dispatch(deletePost(response.data.post._id)); // update global state
      navigate("/posts");
    } catch (error) {
      const axiosError = error as AxiosError;
      if (
        axiosError?.response?.status === 403 ||
        axiosError?.response?.status === 401
      ) {
        // if it's forbidden or unauthorized it will be logged out
        dispatch(switchPrivilege("user")); // logout
        navigate("/log-in");
      } else {
        navigate("/server-error");
      }
    }
  };

  const deleteRef = useRef(Array(post?.comments.length).fill(null));
  const editRef = useRef(Array(post?.comments.length).fill(null));

  const handleDeletion = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    deleteRef.current.forEach((el) => {
      if (el && el.contains(target)) {
        deleteComment(el.dataset.deleteid);
      }
    });
  };
  const handleEdition = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;

    editRef.current.forEach((el) => {
      if (el && el.contains(target)) {
        editComment(el.dataset.editid);
      }
    });
  };

  // MARK: edit comment
  function editComment(commentId: string) {
    const selectedComment = post.comments.filter(
      (comment) => comment._id === commentId,
    )[0];
    setIsEditing(true);
    setCommentToEdit(selectedComment);

    /* Scroll to comments box */
    const commentsBoxSection = document.getElementById("edit-comment-box");
    window.scrollTo({
      top: commentsBoxSection?.offsetTop,
      behavior: "smooth",
    });
  }

  // MARK: delete comment
  async function deleteComment(commentId: string) {
    const apiUrl = `http://localhost:3000/user/comments/${commentId}`;
    try {
      const jwtToken = localStorage.getItem("accessToken");
      const headers: Record<string, string> = {};
      if (jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
      }
      const response = await axios.delete(apiUrl, {
        headers: headers,
      });
      setPost(response.data.post);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (
        axiosError?.response?.status === 403 ||
        axiosError?.response?.status === 401
      ) {
        navigate("/log-in");
      } else {
        navigate("/server-error");
      }
    }
  }

  const { windowWidth } = useWindowSize();

  // MARK: return

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {windowWidth < 769 && <MenuBar />}
      {windowWidth > 768 && <MenuBarLarge />}

      <main className="flex gap-4 px-5 pb-5 pt-24">
        {member === "admin" && (
          <ThemeProvider theme={theme}>
            <div
              className={
                windowWidth > 770
                  ? "fixed flex h-screen w-fit flex-col gap-8 pt-10"
                  : "toolbarBorder fixed bottom-0 left-0 z-50 flex w-screen justify-around bg-white p-2 shadow-[0px_-0.5px_5px_rgb(148,163,184)] dark:bg-slate-800 dark:shadow-none"
              }
            >
              <div>
                <IconButton onClick={() => ScrollTo("comments")}>
                  <Badge badgeContent={post?.comments.length} color="primary">
                    <ForumOutlinedIcon
                      className="icons"
                      fontSize="medium"
                      color="secondary"
                    />
                  </Badge>
                </IconButton>
              </div>
              {post && (
                <div>
                  <IconButton onClick={() => EditPost(post)}>
                    <EditIcon
                      className="icons"
                      fontSize="medium"
                      color="secondary"
                    />
                  </IconButton>
                </div>
              )}
              {post && (
                <div>
                  <IconButton onClick={() => handleDeletePost(post._id)}>
                    <DeleteIcon
                      className="icons"
                      fontSize="medium"
                      color="secondary"
                    />
                  </IconButton>
                </div>
              )}
              <div>
                <IconButton onClick={() => ScrollTo("posts")}>
                  <KeyboardArrowUpIcon
                    className="icons"
                    fontSize="medium"
                    color="secondary"
                  />
                </IconButton>
              </div>
            </div>
          </ThemeProvider>
        )}

        <article className="mx-auto max-w-[900px] rounded-lg border border-solid border-slate-200 bg-white pb-3 sm:w-9/12 dark:border-slate-950 dark:bg-slate-800">
          {/* MARK: Post's header */}
          <header id="post-header">
            <div
              className="relative mx-auto  w-full md:mb-0"
              style={{ height: "24em" }}
            >
              <div
                className="absolute bottom-0 left-0 z-10 h-full w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg,transparent,rgba(0,0,0,.7))",
                }}
              ></div>

              <img
                src={`http://localhost:3000/${post?.file.path}`}
                className="absolute left-0 top-0 h-full w-full rounded-lg object-cover"
              />
              {/* skeleton image */}
              {!post && (
                <div className="bg-custom-animation-1 absolute left-0 top-0 h-full w-full rounded-lg object-cover"></div>
              )}

              <div className="absolute bottom-0 left-0 z-20 p-4">
                <h2 className="except text-3xl font-semibold leading-tight text-gray-100 sm:text-4xl">
                  {post?.title && he.decode(post.title)}
                </h2>
                <div className="mt-3 flex">
                  <div>
                    <p className="text-sm font-semibold text-gray-200">
                      {" "}
                      {post?.author && he.decode(post?.author)}{" "}
                    </p>
                    <p className="text-xs font-semibold text-gray-400">
                      {" "}
                      {post?.date && he.decode(post?.date)}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          {/* MARK: Post's content */}

          {post?.post && (
            <div
              className="prose mx-auto max-w-screen-md border-b-[0.5px] border-l-0 border-r-0 border-t-0 border-solid border-slate-200 p-5 sm:mt-5 md:mt-8 dark:border-slate-600 dark:text-white"
              dangerouslySetInnerHTML={{
                __html: he.decode(post.post), // renders decoded HTML
              }}
            />
          )}

          {/* Skeleton post */}
          {!post && (
            <div className="mx-auto max-w-screen-md animate-pulse border-b-[0.5px] border-l-0 border-r-0 border-t-0 border-solid border-slate-200 p-5 sm:mt-5 md:mt-8">
              {Array.from({ length: 7 }).map((_, i) => (
                <>
                  <div
                    key={i}
                    className="mt-6 h-7 w-1/2 rounded-full bg-slate-600"
                  />
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div
                      key={index}
                      className="mt-3 h-4 w-11/12 rounded-full bg-slate-500"
                    />
                  ))}
                </>
              ))}
            </div>
          )}

          {/* Comment's box */}
          {member === "admin" && post?.post && (
            <CommentsBox
              formData={commentToEdit}
              setFormData={setCommentToEdit}
              setIsEditing={setIsEditing}
              isEditing={isEditing}
              addComment={addComment}
              setPost={setPost}
              post_id={`${post._id}`}
            />
          )}
          <div id="comments-box" className="mx-auto max-w-screen-md">
            {post?.comments?.length > 0 && (
              <div className="mx-auto text-center">
                <h2>Comments</h2>
              </div>
            )}

            {member === "user" && (
              <div className="mx-auto w-11/12 pb-10 pl-5 pr-5 pt-5 text-slate-600 dark:text-slate-300">
                If you want to leave a comment{" "}
                <Link
                  className="font-bold text-slate-800 no-underline dark:text-white"
                  to="/log-in"
                >
                  Log in
                </Link>
              </div>
            )}
            {/* MARK: Comments */}
            {post?.comments.map((comment, index) => (
              <div
                key={comment._id}
                className="mx-auto mb-8 box-border w-11/12 rounded-lg border border-solid border-slate-300 p-5 dark:border-slate-600"
              >
                <div className="relative mb-5 flex h-5 flex-col items-start sm:flex-row sm:gap-2">
                  <div className="font-bold text-slate-500 max-sm:text-xs sm:text-sm dark:text-slate-300">
                    {comment.name}
                  </div>
                  <div className="relative bottom-5 text-slate-400 max-sm:hidden max-sm:text-2xl sm:text-4xl dark:text-slate-200">
                    .
                  </div>
                  <div className="text-slate-500 max-sm:text-[0.70rem] max-sm:leading-[1.390] sm:self-center sm:text-[0.80rem] sm:leading-snug dark:text-slate-300">
                    {comment.date}
                  </div>
                  {member === "admin" && (
                    <div className="absolute right-[-15px] top-[-15px] flex flex-row-reverse">
                      <IconButton
                        className="icons"
                        ref={(el) => (deleteRef.current[index] = el)}
                        data-deleteid={comment._id}
                        data-author={comment.author}
                        onClick={handleDeletion}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      {comment.author === user._id && (
                        <IconButton
                          className="icons"
                          ref={(el) => (editRef.current[index] = el)}
                          data-editid={comment._id}
                          data-author={comment.author}
                          onClick={handleEdition}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                    </div>
                  )}
                </div>
                <div className="truncate text-pretty text-base">
                  {/* Converts avery \n into a paragraph */}
                  {comment.comment.split("\n").map((line, i) => (
                    <p key={`${comment._id}${i}`}>{he.decode(line)}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      </main>

      {member === "user" && (
        <span onClick={() => ScrollTo("comments")}>
          <div className="fixed bottom-5 left-5 w-fit cursor-pointer rounded-full bg-neutral-950 p-3 dark:bg-purple-700">
            <ThemeProvider theme={theme}>
              {post?.comments && (
                <Badge badgeContent={post.comments.length} color="primary">
                  <ForumIcon fontSize="large" color="info" />
                </Badge>
              )}
            </ThemeProvider>
          </div>
        </span>
      )}
    </div>
  );
}

export default Post;
